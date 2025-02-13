import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Correcta importación
import { ToastrModule } from 'ngx-toastr'; // Importación de ngx-toastr

// Inicializa la aplicación y proporciona HttpClientModule globalmente
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), // Añade HttpClientModule aquí
    importProvidersFrom(BrowserAnimationsModule), // Importa el módulo de animaciones
    importProvidersFrom(ToastrModule.forRoot()), // Configura Toastr globalmente
    ...appConfig.providers // Si tienes más proveedores en appConfig
  ]
})
.catch((err) => console.error(err));

