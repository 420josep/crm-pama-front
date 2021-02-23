import { Component, OnInit } from '@angular/core';
import { Company, PricingItem } from 'src/app/templates/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/templates/user';
import { HttpEventType } from '@angular/common/http';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  editCompanyForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  currentCompany: Company;
  companyID: string;
  existCompany: boolean = true;
  currentUser: User;
  pricingItems: PricingItem[];
  companyLogo: File;
  isUploading: boolean = false;
  companyLogoSrc: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companiesService: CompaniesService
  ) { 
  }

  ngOnInit() {
    //Obtengo el id del proveedor seleccionado desde los parámetros de la URL
    this.companyID = this.route.snapshot.paramMap.get("id");
    this.currentUser = this.authService.getUser;

    this.getCompany(this.companyID);

    // Asignación de variables y método de validación
    this.editCompanyForm = this.formBuilder.group({
      companyID: ['', [Validators.required]],
      logo: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      manager: ['', [Validators.required, Validators.maxLength(100)]],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      pricingID: ['', [Validators.required]],
      state: ['', [Validators.required]]
    });

    this.companiesService.getPricing().subscribe(response => {
      if(response){
        this.pricingItems = response;
      }else{
        this.pricingItems = [];
      }
    });
  }

  get form() {
    return this.editCompanyForm.controls;
  }

  getCompany( companyID: string ){
    this.companiesService.getCompany(companyID).subscribe( response => {
      if(response){
        this.currentCompany = response;
        this.form.companyID.setValue(this.currentCompany.id);
        this.form.logo.setValue(this.currentCompany.logo);
        this.companyLogoSrc = environment.apiURL + this.currentCompany.logo;
        this.form.name.setValue(this.currentCompany.name);
        this.form.manager.setValue(this.currentCompany.manager);
        this.form.contact.setValue(this.currentCompany.contact);
        this.form.pricingID.setValue(this.currentCompany.pricingID);
        this.form.state.setValue(this.currentCompany.state);
      }else{
        this.existCompany = false;
        this.response = false;
        this.message = "La empresa buscada no existe"
      }
    });
  }

      /**
   * Método que se encarga de validar la subida de los archivos,
   * asigna el base64 de la imagen en el campo correspondiente del formulario
   * y una vez subida la foto asignarla a su contenedor de vista previa
   * @param files Valor del input de tipo "FILE" que sube el archivo
   * @param img DOM donde se mostrará la imagen
   */
  onFileChange(files: any, img: any) {
    // Si no se subió nada o si se canceló la subida se pone por default la URL de la imagen
    // y se sale del método
    if (files.target.files.length === 0) {
      img.removeAttribute('src');
      this.form.logo.setValue('');
      this.companyLogo = null;
      this.companyLogoSrc = null;
      return;
    }
    // Asignación y validación de formato del archivo subido
    let mimeType = files.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo se permiten imágenes";
      return;
    }

    this.companyLogo = files.target.files[0];
    this.form.logo.setValue(files.target.files[0].name);
    this.companyLogoSrc = null;

    // Asignación de valor
    var reader = new FileReader();
    reader.readAsDataURL(files.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
    }
  }

  saveCompany(){
    // Declaración de variable que indica que ya fue hundido el botón de guardar
    this.submitted = true;

    // Validación de si hay errores en el formulario o no se ha llenado algún campo
    if (this.editCompanyForm.invalid) {
      this.message = '';
      this.response = true;
      return;
    } else {
      // se crea un objeto FormData y se asigna su información. contendrá los datos a enviar al backend
      const form = new FormData();
      form.append('companyID', this.form.companyID.value);
      form.append('name', this.form.name.value);
      form.append('manager', this.form.manager.value);
      form.append('contact', this.form.contact.value);
      form.append('pricingID', this.form.pricingID.value);
      if (this.companyLogo) {
        form.append('logo', this.companyLogo, this.companyLogo.name);
      }
      form.append('state', this.form.state.value);

      // Se asigna el valor a la bandera para desactivar los botones y que no se puedan enviar varias veces la misma información
      this.isUploading = true;
      // Una vez todo esté correcto y asignada la información a la nueva variable se procede a hacer el envío al servicio para enviar al backend
      this.companiesService.updateCompany(form).subscribe(response => {
        // Switch de la respuesta para validar el estado de la subida de la información al servidor
        switch (response.type) {
          // Caso que me muestra el % de subida de la información
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * response.loaded / response.total);
            break;

          // Caso que me muestra el % de subida de la información
          case HttpEventType.ResponseHeader:
            break;
          // Caso final, es la respuesta del backend
          case HttpEventType.Response:
            this.isUploading = false;
            this.response = response.body['response'];
            if (this.response) {

              this.message = '';
              this.response = true;
              this.router.navigate(['menu/empresas/lista']);
            } else {
              this.message = response.body['message'];
            }
            break;
        }
      });
    }
  }  
}
