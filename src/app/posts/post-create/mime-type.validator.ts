import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
      fileReader.addEventListener("loadend", () => {
        const result = fileReader.result;
        if (result instanceof ArrayBuffer) {
          const arr = new Uint8Array(result).subarray(0, 4);
          let header = '';
          let isValid = false;
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false;
              break;
          }
          if (isValid) {
            observer.next({ invalidMimeType: false });
          } else {
            observer.next({ invalidMimeType: true });
          }
          observer.complete();
        } else {
          observer.error("Failed to read file.");
        }
      });
      fileReader.readAsArrayBuffer(file);
    });
    return frObs;
  }
  