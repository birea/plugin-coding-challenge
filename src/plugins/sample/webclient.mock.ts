export class WebClient {
  constructor(auth: any) {};

  async postMessage(payload: IRequestPayload): Promise<IResult> {
    console.log(`Message "${payload.text}" to "${payload.channel}"`);
    return {
      ok: true
    }
  }
}

interface IResult {
  ok: boolean;
}

interface IRequestPayload {
  text: string;
  channel: string;
}