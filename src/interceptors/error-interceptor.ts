import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from "../dto/models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(
        public storage: StorageService,
        public alertCtrl: AlertController
        ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req)
            .catch((error, caught) =>{

                let errorObj = error;
                if(errorObj.error){
                    errorObj = errorObj.error;
                }
                if(!errorObj.status){
                    errorObj = JSON.parse(errorObj);
                }

                console.log('Erro detectado pelo interceptador:');
                console.log(errorObj);

                switch(errorObj.status){
                    case 403:
                        this.handle403();
                        break;

                    case 401:
                        this.handle401();
                        break;

                    case 404:
                        this.handle404();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;

                    default:  
                        this.hendleDefaultError(errorObj);
                        break;  
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    handle403(){
        this.storage.setLocalUser(null);
    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401, Falha na autenticação',
            message: 'Email ou senha incorreta',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    handle404(){
        let alert = this.alertCtrl.create({
            title: 'Erro 404, Não encontrado',
            message: 'Não foi possível encontrar o conteúdo',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    handle422(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação ',
            message: this.listErrors(errorObj.erros),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    hendleDefaultError(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }


    listErrors(messages: FieldMessage[]) : string{
        let s: string = '';
        for(var i = 0; i < messages.length; i++){
            s = s + '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>';
        }
        return s;
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};