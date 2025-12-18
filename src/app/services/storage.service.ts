import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getItem(key:string):string|null{
    if(!isPlatformBrowser(this.platformId)){
      return null;
    }
    return localStorage.getItem(key);
  }

  setItem(key:string,value:string):void{
     if(!isPlatformBrowser(this.platformId)){
      return;
    }
    localStorage.setItem(key,value);
  }

  getItemObject<T>(key:string):T|null{
    try{
      const res = this.getItem(key);
      if(!res){
        return null;
      }
      return JSON.parse(res) as T;
    }catch(e){
      console.error('Failed to parse localStorage data', e);
      return null;
    }
    
  }

  setItemObject<T>(key:string,value:T):void{
    this.setItem(key,JSON.stringify(value));
  }

private encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
}

// Decode Base64 to UTF-8

 private decodeBase64(base64: string): string {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
}
