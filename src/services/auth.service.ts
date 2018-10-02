import { Injectable } from "@angular/core";
import { CredencialDTO } from "../dto/models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../dto/models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

    constructor(
        public http: HttpClient,
        public storage: StorageService
        ){}

    authenticate(creds: CredencialDTO){
        if(creds != null){
            return this.http.post(
                `${API_CONFIG.baseUrl}/login`, 
                creds,
                {
                    observe: 'response',
                    responseType: 'text'
                });
        }
    }

    successfulLogin(authorizationValue: string){
        if(authorizationValue != null){
            let tok = authorizationValue.substring(7);
            let user: LocalUser = {
                token: tok
            };
            this.storage.setLocalUser(user);
        }
    }

    logout(){
        this.storage.setLocalUser(null);
    }

}