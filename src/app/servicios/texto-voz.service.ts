import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})
export class TextoVozService {

  constructor(
    private tts: TextToSpeech
  ) { }

  interpretar(text: string) {
    return this.tts.speak({
      text,
      locale: 'es-CO',
    }).catch(reason => console.log('reason', reason));
  }
}
