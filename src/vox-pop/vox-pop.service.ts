import { Injectable } from '@nestjs/common';
import { createClient, TumblrClient, TextPostParams } from 'tumblr.js';
import { LoggerService } from '../logger/logger.service';
import { voxPop } from './interface/vox-pop.interface'

@Injectable()
export class VoxPopService {
  private client: TumblrClient;
  blogName: string = 'hfht-bot';
  blogURL: string = 'https://hfht-bot.tumblr.com/';
  posts: voxPop[] = [];

  constructor(private log: LoggerService) {
    this.client = createClient({
      credentials: {
        consumer_key: '18ylKdp8vfz6DQQjuXP2rQf8w7ThPNSvp5wBZkuyQnbl2og1Db',
        consumer_secret: 'XuSKR37fCSeHLcC5vfZ2ZCveBcFHDeOPDFr4AYKBiJNHvuGHPz',
        token: 'Ie7FCYxxhBJQSHI9jERJG5fGacGqAfXS8G8seJfTmqjD4EvHEQ',
        token_secret: 'FmyLmlTaBvrABUF4i4e0JcwHOGqYwcbGv2BuJRaVnkJkMoEgLd'
      }
    });

    // keep this here as a guide
    // this.client.userInfo(function (err, data) {
    //   console.log(data);
    //   data.user.blogs.forEach(function(blog) {
    //     console.log(blog.name);
    //   });
    // })
  }

  enqueue(voxPop: voxPop): number {
    let abbr: string = voxPop.submission;
    if (voxPop.submission.length > 16) {
      abbr = voxPop.submission.slice(0, 16) + '. . .';
    }

    this.log.write(`Enqueuing following post: ${abbr}`);
    return this.posts.push(voxPop);
  }

  post(voxPop: voxPop): string {
    let postID: string = '';

    const params = {body: voxPop.submission} as TextPostParams;
    this.client.createTextPost(this.blogName, params, function(err, data) {
      if (err !== null) {
        console.log(`Failed to create a text post - ${err}`)
        return postID;
      }
      postID = data.id_string;
      console.log(`Successfully created text post with ID ${postID}`);
    });
    return postID;
  }

  delete(postID: string): void {
    const params = {id: postID} as Object
    this.client.deletePost(this.blogName, params, function(err, data) {
      if (err !== null) {
        console.log(`Failed to delete text post - ${err}`)
        return;
      }
      console.log(`Successfully deleted post with ID ${postID}`);
    });
    return;
  }

  // TODO: fix this shit
  // async getPostIDs(): Promise<string[]> {
  //   return new Promise((resolve, reject) => {
  //     let postIDs: string[] = [];
  //     this.client.blogPosts(this.blogName, function(err, data) {
  //       if (err !== null) {
  //         console.log(`Failed to get post IDs - ${err}`)
  //         reject()
  //       }
  //       data.posts.forEach(function(post) {
  //         postIDs.push(post.id_string);
  //       });
  //     });
  //     resolve(postIDs);
  //   })
  // }

  // async deleteAll(): Promise<void> {
  //   let postIDs: string[] = await this.getPostIDs();
  //   if (postIDs.length === 0) {
  //     console.log(`No posts to delete!`);
  //     return;
  //   }

  //   for (let i = 0; i < postIDs.length; i++) {
  //     console.log(`Attempting to delete post with ID ${postIDs[i]}`);
  //     this.delete(postIDs[i]);
  //   }
  //   console.log(`Successfully deleted all text posts`);
  // }
}
