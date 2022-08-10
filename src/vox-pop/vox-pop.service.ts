import { Injectable } from '@nestjs/common';
import { createClient, TumblrClient } from 'tumblr.js';
import { LoggerService } from '../logger/logger.service';
import { voxPop } from './interface/vox-pop.interface'

@Injectable()
export class VoxPopService {
  private tumblrClient: TumblrClient | null = null;
  posts: voxPop[] = [];

  constructor(private log: LoggerService) {
    this.tumblrClient = this.authenticate();

    let response, rawResponse = '';
    this.tumblrClient.userInfo(function(err, resp, rawResp) {
      console.log(err);
      rawResponse = JSON.stringify(rawResp);
    });
  }

  authenticate(): TumblrClient | null {
    let t: TumblrClient | null = null;
    try {
      t = createClient({
        credentials: {
          consumer_key: '18ylKdp8vfz6DQQjuXP2rQf8w7ThPNSvp5wBZkuyQnbl2og1Db',
          consumer_secret: 'XuSKR37fCSeHLcC5vfZ2ZCveBcFHDeOPDFr4AYKBiJNHvuGHPz',
          token: '41RRIc45CKUwYZzvnBEaq5rp7YKpX5Bz6vJ7efp4QRxgnWk4zT',
          token_secret: '1kU4AGoF4HLqUxccBI7q3XZwiJoTo8ZZwBr6I7AhNNTrr2XKt7'
        },
        returnPromises: true,
      });
    } catch (e) {
      this.log.error('Failed to create tumblr client - ' + (e as Error).message);
      return null;
    }
    this.log.succ('Tumblr client successfully authenticated');
    return t;
  }
}
