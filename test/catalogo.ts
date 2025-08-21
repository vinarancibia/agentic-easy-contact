export interface Auto {
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  disponible: number;
}

export const catalogAutosTest: Auto[] = [
  {
    codigo: "A001",
    nombre: "EcoSport Titanium",
    marca: "Ford",
    modelo: "2022",
    descripcion: "SUV compacta ideal para ciudad, buen rendimiento de combustible.",
    precio: 18500,
    imagen: "https://i.ytimg.com/vi/qDi1lZbCGAs/maxresdefault.jpg",
    disponible: 3
  },
  {
    codigo: "A002",
    nombre: "Corolla SE",
    marca: "Toyota",
    modelo: "2023",
    descripcion: "Sedán elegante y confiable, excelente para uso diario.",
    precio: 22000,
    imagen: "https://www.toyotaoforlando.com/blogs/6087/wp-content/uploads/2024/11/2025-Toyota-Corolla-LE-in-Orlando-FL.jpg",
    disponible: 5
  },
  {
    codigo: "A003",
    nombre: "Civic Touring",
    marca: "Honda",
    modelo: "2022",
    descripcion: "Sedán deportivo con diseño moderno y buena eficiencia.",
    precio: 23500,
    imagen: "https://www.easygifanimator.net/images/samples/video-to-gif-sample.gif",
    disponible: 2
  },
  {
    codigo: "A004",
    nombre: "Rav4 XLE",
    marca: "Toyota",
    modelo: "2023",
    descripcion: "SUV versátil con buen espacio y tracción integral.",
    precio: 29000,
    imagen: "https://i.ytimg.com/vi/UnoPmTV7G8o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAMXZcQabOJvBExVNYVtK6jGMv9sw",
    disponible: 4
  },
  {
    codigo: "A005",
    nombre: "Mazda 3 Hatchback",
    marca: "Mazda",
    modelo: "2023",
    descripcion: "Compacto deportivo con excelente manejo y diseño premium.",
    precio: 21000,
    imagen: "https://di-uploads-pod2.dealerinspire.com/mazdaofmanchester/uploads/2016/09/2016-Mazda-Hatchback-Exterior-01.png",
    disponible: 6
  },
  {
    codigo: "A006",
    nombre: "Chevrolet Onix Premier",
    marca: "Chevrolet",
    modelo: "2023",
    descripcion: "Sedán compacto con buen equipamiento y seguridad.",
    precio: 16500,
    imagen: "https://fotos.perfil.com/2020/01/03/nuevo-chevrolet-onix-llegaron-las-versiones-premier-con-motor-turbo-844860.jpg",
    disponible: 7
  },
  {
    codigo: "A007",
    nombre: "Kia Seltos LX",
    marca: "Kia",
    modelo: "2023",
    descripcion: "SUV moderno con diseño juvenil y eficiente motor.",
    precio: 22500,
    imagen: "https://www.kia.com/content/dam/kia/us/en/vehicles/seltos/2025/in-page-gallery/kia_my25_seltos-mep-in-page-gallery-ext1.jpg",
    disponible: 5
  },
  {
    codigo: "A008",
    nombre: "Hyundai Tucson",
    marca: "Hyundai",
    modelo: "2023",
    descripcion: "SUV mediano con tecnología avanzada y gran espacio interior.",
    precio: 28000,
    imagen: "https://fotos.quecochemecompro.com/hyundai-tucson/hyundai-tucson-vista-lateral.jpg?size=750x400",
    disponible: 4
  },
  {
    codigo: "A009",
    nombre: "Renault Kwid",
    marca: "Renault",
    modelo: "2022",
    descripcion: "Auto urbano compacto, económico y ágil para ciudad.",
    precio: 9800,
    imagen: "https://cdn.motor1.com/images/mgl/qkMpP1/s3/para_portada.jpg",
    disponible: 10
  },
  {
    codigo: "A010",
    nombre: "Volkswagen Virtus Highline",
    marca: "Volkswagen",
    modelo: "2023",
    descripcion: "Sedán con excelente espacio interior y buen equipamiento.",
    precio: 19500,
    imagen: "https://cdn.motor1.com/images/mgl/BXQkb6/s3/avaliacao-volkswagen-virtus-highline-200tsi-2023.jpg",
    disponible: 3
  },
  {
    codigo: "A011",
    nombre: "Nissan Versa SR",
    marca: "Nissan",
    modelo: "2023",
    descripcion: "Sedán moderno con gran eficiencia de combustible y conectividad.",
    precio: 17900,
    imagen: "https://cdn.autoproyecto.com/wp-content/uploads/2024/03/1-2024-Nissan-Nissan-Versa-40.jpg",
    disponible: 8
  },
  {
    codigo: "A012",
    nombre: "Peugeot 208 Active",
    marca: "Peugeot",
    modelo: "2022",
    descripcion: "Hatchback elegante y práctico, ideal para ciudad.",
    precio: 14500,
    imagen: "https://e9iwhqzsmh4.exactdn.com/wp-content/uploads/2017/10/208Foto1-6-16.jpg",
    disponible: 4
  },
  {
    codigo: "A013",
    nombre: "Fiat Pulse Drive",
    marca: "Fiat",
    modelo: "2023",
    descripcion: "Crossover compacto con diseño atractivo y buen equipamiento.",
    precio: 16900,
    imagen: "https://www.fiat.com.mx/content/dam/cross-regional/nafta/fiat/es_mx/2025/Pulse-2025/01-Inicio/desktop/fiat-pulse-2025-dise%C3%B1o.jpg",
    disponible: 6
  },
  {
    codigo: "A014",
    nombre: "Suzuki Swift GLX",
    marca: "Suzuki",
    modelo: "2022",
    descripcion: "Auto compacto, ágil y económico, ideal para ciudad.",
    precio: 13200,
    imagen: "https://images.carmag.co.za/wp-content/uploads/2024/10/1-21-1024x614.jpg",
    disponible: 5
  },
  {
    codigo: "A015",
    nombre: "Jeep Renegade Longitude",
    marca: "Jeep",
    modelo: "2023",
    descripcion: "SUV robusto con buen desempeño en todo tipo de caminos.",
    precio: 26500,
    imagen: "https://faiautos.com/wp-content/uploads/2023/10/0FAI_Jeep-Renegade-LONGITUDE-2023-Negro_01194.jpg",
    disponible: 2
  }
];
