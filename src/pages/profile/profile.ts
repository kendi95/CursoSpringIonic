import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { ClienteDTO } from '../../dto/models/cliente.dto';
import { API_CONFIG } from '../../config/api.config';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  userPicture: String;
  cameraOn: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
    public platform: Platform) {}

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser();

    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response =>{
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        error =>{
          if(error.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        })
    } else {
      this.navCtrl.setRoot('HomePage');
    }

  }

  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response =>{
        this.cliente.imageUrl = `${API_CONFIG.baseUrlBucket}/cp${this.cliente.id}.jpg`;
      },
      error =>{});
  }


  // the lifecicle of this app need be fix, this plugin Camera 
  getCameraPicture(){

    this.cameraOn = true;

    if (this.platform.is('cordova')) {
			const options: CameraOptions = {
				quality: 100,
				destinationType: this.camera.DestinationType.DATA_URL,
				encodingType: this.camera.EncodingType.JPEG,
				mediaType: this.camera.MediaType.PICTURE,
				sourceType: this.camera.PictureSourceType.CAMERA
			}

			this.camera.getPicture(options).then((imageData) => {
				let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.userPicture = base64Image;
        this.cameraOn = false;
			}).catch((err) => {
        this.cameraOn = false;
			});

		}

	}

  sendPicture(){
    this.clienteService.uploadPicture(this.userPicture)
      .subscribe( response =>{
        this.userPicture = null;
        this.loadData();
      },
      error => {});
  }

  cancel(){
    this.userPicture = null;
  }

}
