import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
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
          log.succ('Successfully authenticated to ' + blog.name);
        });
      }
    })
  }

  async createTumblrPost(voxPop: voxPop): Promise<string> {
    let postID: string = '';
    const params = {body: voxPop.submission} as TextPostParams;

    await this.tumblrClient.createTextPostWithPromise(this.blogName, params)
      .then(data => {
        postID = data.id_string;
        if (!!postID) {
          this.log.succ('Created post with content "' + voxPop.submission + '" and tumblr ID of ' + postID);
        } else {
          this.log.error('Something went wrong for post with content "' + voxPop.submission + '"');
        }
      })
      .catch(err => console.log(err));

    await this.postsService.create({
      userIP: voxPop.userIP,
      timestamp: voxPop.timestamp,
      submission: voxPop.submission,
      postID: postID,
    })
      .catch(err => console.log(err));

    return postID;
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
