import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { PricingItem } from 'src/app/templates/company';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  newCompanyForm: FormGroup;
  submitted: boolean = false;
  // Variable que contendrá el mensaje de respuesta si hubo error al guardar el proveedor
  message: string;
  // Variable usada para validar si la respuesta desde el API fue correcta
  response: boolean = true;
  pricingItems: PricingItem[];
  companyLogo: File;
  isUploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private companiesService: CompaniesService,
    ) { }

  ngOnInit() {
    // Asignación de variables y método de validación
    this.newCompanyForm = this.formBuilder.group({
      logo: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      manager: ['', [Validators.required, Validators.maxLength(100)]],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      pricingID: ['', [Validators.required]]
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
    return this.newCompanyForm.controls;
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

    // Asignación de valor
    var reader = new FileReader();
    reader.readAsDataURL(files.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
    }
  }

    /**
   * Método el cual se ejecutará al llamado del botón del formulario que
   * enviará el formulario al servicio para ser guardado como proveedor
   */
  saveCompany(){
    // Declaración de variable que indica que ya fue hundido el botón de guardar
    this.submitted = true;

    // Validación de si hay errores en el formulario o no se ha llenado algún campo
    if (this.newCompanyForm.invalid) {
      this.message = '';
      this.response = true;
      return;
    } else {
      // se crea un objeto FormData y se asigna su información. contendrá los datos a enviar al backend
      const form = new FormData();

      form.append('name', this.form.name.value);
      form.append('manager', this.form.manager.value);
      form.append('contact', this.form.contact.value);
      form.append('pricingID', this.form.pricingID.value);
      form.append('logo', this.companyLogo, this.companyLogo.name);

      // Se asigna el valor a la bandera para desactivar los botones y que no se puedan enviar varias veces la misma información
      this.isUploading = true;
      // Una vez todo esté correcto y asignada la información a la nueva variable se procede a hacer el envío al servicio para enviar al backend
      this.companiesService.createCompany(form).subscribe(response => {
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
