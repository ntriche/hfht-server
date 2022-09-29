import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/schema/post.schema';
import { createClient, TumblrClient, TextPostParams } from 'tumblr.js';
import { LoggerService } from '../logger/logger.service';
import { voxPop } from './interface/vox-pop.interface'

@Injectable()
export class VoxPopService {
  private tumblrClient: TumblrClient;
  blogName: string = 'hfht-bot';
  blogURL: string = 'https://hfht-bot.tumblr.com/';
  posts: voxPop[] = [];

  constructor(private readonly postsService: PostsService, private log: LoggerService) {
    this.tumblrClient = createClient({
      credentials: {
        consumer_key: '18ylKdp8vfz6DQQjuXP2rQf8w7ThPNSvp5wBZkuyQnbl2og1Db',
        consumer_secret: 'XuSKR37fCSeHLcC5vfZ2ZCveBcFHDeOPDFr4AYKBiJNHvuGHPz',
        token: 'Ie7FCYxxhBJQSHI9jERJG5fGacGqAfXS8G8seJfTmqjD4EvHEQ',
        token_secret: 'FmyLmlTaBvrABUF4i4e0JcwHOGqYwcbGv2BuJRaVnkJkMoEgLd'
      },
      returnPromises: true,
    });

    this.tumblrClient.userInfo(function (err, data) {
      if (!!data) {
        data.user.blogs.forEach(function(blog) {
          log.write('Successfully authenticated to ' + blog.name);
        });
      }
    })
  }

  async createTumblrPost(voxPop: voxPop): Promise<string> {
    let html = '<span>' + this.createChanTimestamp(voxPop.timestamp) + '</span>\n<div>' + this.removeHTMLTags(voxPop) + '</div>\n';
    
    const params = {body: html} as TextPostParams;
    await this.tumblrClient.createTextPostWithPromise(this.blogName, params)
      .then(data => {
        if (!!data.id_string) {
          voxPop.postID = data.id_string;
          this.log.write('Created post with UUID ' + voxPop.UUID + ' and post ID of ' + voxPop.postID);
        } else {
          this.log.error('Something went wrong for post with UUID "' + voxPop.UUID + '"');
        }
      })
      .catch(err => console.log(err));

    const newPost = new Post(voxPop);
    await this.postsService.create(newPost)
      .catch(err => console.log(err));

    return voxPop.postID;
  }

  removeHTMLTags(voxPop: voxPop): string {
    const reg = new RegExp(/<.+?>/gm);
    if (voxPop.submission.search(reg) === -1) {
      return voxPop.submission;
    }

    if (!!!voxPop.alteredSubmission) {
      voxPop.alteredSubmission = voxPop.submission.replaceAll(reg, '');
      this.log.write('Submission contains HTML tags. New submission is as follows: ' + voxPop.alteredSubmission);
      return voxPop.alteredSubmission;
    } else {
      throw 'Vox Pop alternative submission is not empty!';
    }
  }

  createChanTimestamp(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const localeDate = date.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'}).split(',');
    return localeDate[1].trimStart() + '(' + localeDate[0] + ')' + date.toLocaleTimeString('en-GB');
  }

  // TODO: enqueue should make sure the post it is enqueuing hasn't already been posted by querying the DB
  enqueuePost(voxPop: voxPop): number {
    let abbr: string = voxPop.submission;
    if (voxPop.submission.length > 16) {
      abbr = voxPop.submission.slice(0, 16) + '. . .';
    }

    this.log.write(`Enqueuing following post: ${abbr}`);
    return this.posts.push(voxPop);
  }

  // TODO: should also delete from the DB, or posts in the DB should have a flag to mark if they have been deleted from the blog
  // TODO: check and ensure if this needs a new method written in tumblr.d.ts to use promises instead of callbacks
  deleteTumblrPost(postID: string): void {
    const params = {id: postID} as Object
    this.tumblrClient.deletePost(this.blogName, params, function(err, data) {
      if (err !== null) {
        console.log(`Failed to delete text post - ${err}`)
        return;
      }
      console.log(`Successfully deleted post with ID ${postID}`);
    });
    return;
  }
}
