import { Get, Injectable, Param } from '@nestjs/common';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as cache from 'memory-cache';

@Injectable()
export class SmsService {
  private readonly NAVER_ACCESS_KEY = process.env.NAVER_ACCESS_KEY;
  private readonly NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY;
  private readonly NAVER_SERVICE_ID = process.env.NAVER_SERVICE_ID;
  private readonly NAVER_SMS_SEND_NUMBER = process.env.NAVER_SMS_SEND_NUMBER;

  showCache(key) {
    console.log(key);
    console.log(cache.size());
    console.log(cache.get(key));
    return 'succeed';
  }

  async sendAuthenticationCode(userPhoneNumber: number) {
    const host = 'https://sens.apigw.ntruss.com';

    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = `/sms/v2/services/${this.NAVER_SERVICE_ID}/messages`;
    const timestamp = Date.now().toString();
    const accessKey = this.NAVER_ACCESS_KEY;
    const secretKey = this.NAVER_SECRET_KEY;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    console.log('hash >> ', hash);
    console.log('signature >> ', signature);

    const random6Number = [0, 0, 0, 0, 0, 0];

    random6Number.forEach((v, i) => {
      random6Number[i] = Math.floor(Math.random() * 10);
    });

    console.log('random6Number >> ', random6Number);
    const stringRandom6Number = random6Number.join('');
    console.log('stringRandom6Number >> ', stringRandom6Number);

    const payload = {
      type: 'SMS',
      countryCode: '82',
      from: this.NAVER_SMS_SEND_NUMBER,
      content: `[벼락장터] 인증번호는 ${stringRandom6Number}입니다.`,
      messages: [
        {
          to: userPhoneNumber,
        },
      ],
    };

    console.log('payload >> ', payload);

    axios({
      method,
      url: `${host}${url}`,
      headers: {
        'Contenc-type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': this.NAVER_ACCESS_KEY,
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: payload,
    })
      .then((res) => {
        console.log('res >> ', res);
      })
      .catch((err) => {
        console.log('err >> ', err);
        console.log('err >> ', err.data);
      });

    // const resultSendMessage = async () => {
    //   try {
    //     const res = await axios.post(`${host}${url}`, payload, {
    //       headers: {
    //         'Contenc-type': 'application/json; charset=utf-8',
    //         'x-ncp-iam-access-key': this.NAVER_ACCESS_KEY,
    //         'x-ncp-apigw-timestamp': timestamp,
    //         'x-ncp-apigw-signature-v2': signature,
    //       },
    //     });
    //     cache.put(userPhoneNumber, stringRandom6Number);
    //
    //     return res;
    //   } catch (err) {
    //     console.log('resultSendMessage err >> ', err);
    //   }
    // };
    // console.log('resultSendMessage >> ', resultSendMessage());
    //
  }
}