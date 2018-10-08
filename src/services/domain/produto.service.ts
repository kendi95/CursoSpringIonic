import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { ProdutoDTO } from "../../dto/models/produto.dto";

@Injectable()
export class ProdutoService{

    constructor(public http: HttpClient){}

    findByCategoria(categoria_id: string){
        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
    }

    findById(produto_id: string){
        return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${produto_id}`);
    }

    getSmallImageFromBucket(produto_id: string): Observable<any>{
        return this.http.get(
            `${API_CONFIG.baseUrlBucket}/prod${produto_id}-small.jpg`,
            {responseType: 'blob'}
        );
    }

    getImageFromBucket(produto_id: string): Observable<any>{
        return this.http.get(
            `${API_CONFIG.baseUrlBucket}/prod${produto_id}.jpg`,
            {responseType: 'blob'}
        );
    }

}