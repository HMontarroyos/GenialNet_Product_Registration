export interface Supplier {
  name: string;
  cnpj: string;
  cep: string;
  tel: string;
  address: string;
  city: string;
  state: string;
  products: any;
}

export interface Product {
  description: string;
  supplier: string;
  brand: string;
  unitOfMeasurement: string;
  image: string;
}

export const supplierDataEmpty = {
  name: "",
  cnpj: "",
  cep: "",
  tel: "",
  address: "",
  city: "",
  state: "",
  products: [],
};

export const productDataEmpty = {
  description: "",
  brand: "",
  unitOfMeasurement: "",
  image: "",
  supplier: "",
};

export const errorsEmpty = {
  name: "",
  cnpj: "",
  cep: "",
  tel: "",
  brand: "",
  description: "",
};

export const messageSupplierEmpty =
  "Você ainda não tem nenhum fornecedor cadastrado.";
