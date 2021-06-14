## Reto Ripio - backend

### Antes de empezar 
> Una vez actuvado el ambiente virtual e instalado las dependencias del archivo requirements.txt
> lo siguiente será ejecutar el archivo bach firts_steps.sh el cual realizara las migraciones de
> django y tambien ejecutara unas sentencias SQL
> esas sentencias SQL generaran triggers para la suma y resta de monedas de los usuarios
> > sh firts_steps.sh 

### Acerca del funcionamiento del backend:
> Para realizar las peticiones debes incluir el api key en la cabecera cuyo valor es "default-key"
> *   Header: x-api-key=default-key
> Tambien es necesario incluir el Authorization en las peticiones, excepto para las APIs de usuarios
> para conseguir el valor del Authorization es necesario: registrar al usuario y luego loguearlo
> *   Header: Authorization=Token token_de_usuario

