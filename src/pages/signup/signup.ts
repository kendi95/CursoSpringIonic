import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoService } from '../../services/domain/estado.service';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoDTO } from '../../dto/models/estado.dto';
import { CidadeDTO } from '../../dto/models/cidade.dto';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public estadoService: EstadoService,
    public cidadeService: CidadeService) {

      this.formGroup = this.formBuilder.group({
        nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
        tipo: ['1', [Validators.required]],
        cpfOuCnpj: ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['123', [Validators.required]],
        logradouro: ['Rua Via', [Validators.required]],
        numero: ['25', [Validators.required]],
        complemento: ['Apto 3', []],
        bairro: ['Copacabana', []],
        cep: ['10828333', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        telefone1: ['977261827', [Validators.required]],
        telefone2: ['', []],
        telefone3: ['', []],
        estadoId: [null, [Validators.required]],
        cidadeId: [null, [Validators.required]]
      });

    }

  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(response =>{
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
        this.updateCidades();
      },
      error =>{});
  }

  cancel(){
    this.navCtrl.setRoot('HomePage');
  }

  signupUser(){
    this.formBuilder
  }

  updateCidades(){
    let estadoId = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estadoId)
      .subscribe( response =>{
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null);
      },
      error =>{});
  }

}
