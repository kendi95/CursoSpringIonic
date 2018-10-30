import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../dto/models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class ClienteService{

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageService: ImageUtilService){}

    findByEmail(email: string){

        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    findById(id: string){

        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    getImageFromBucket(id: string): Observable<any>{
        return this.http.get(
            `${API_CONFIG.baseUrlBucket}/cp${id}.jpg`,
            {responseType: 'blob'}
        );
    }

    insert(obj: ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    uploadPicture(picture){
        let pictureBlob = this.imageService.dataUriToBlob(picture);
        let formData: FormData = new FormData();

        formData.append('file', pictureBlob, 'file.png');

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData, 
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

}