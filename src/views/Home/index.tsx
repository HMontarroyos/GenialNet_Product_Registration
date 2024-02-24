import React, { useState, ChangeEvent, useEffect } from "react";
import { Button, Menu } from "../../components";
import * as S from "./styled";
import "./style.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getCep } from "../../server/api";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface Supplier {
  name: string;
  cnpj: string;
  cep: string;
  tel: string;
  address: string;
  city: string;
  state: string;
  products: any;
}

interface Product {
  description: string;
  supplier: string;
  brand: string;
  unitOfMeasurement: string;
  image: string;
}

function Home() {
  const [content, setContent] = useState("produto");
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [supplierData, setSupplierData] = useState<Supplier>({
    name: "",
    cnpj: "",
    cep: "",
    tel: "",
    address: "",
    city: "",
    state: "",
    products: [],
  });
  const [productData, setProductData] = useState<Product>({
    description: "",
    brand: "",
    unitOfMeasurement: "",
    image: "",
    supplier: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    cnpj: "",
    cep: "",
    tel: "",
    brand: "",
    description: "",
  });
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    setSuppliersList(suppliers);
    setProductsList(products);
  }, []);

  const handleItemClick = (item: string) => {
    setContent(item);
  };

  const handleOpenModalProduct = () => {
    setContent("produto");
    setOpenModal(true);
  };

  const handleOpenModalSupplier = () => {
    setContent("fornecedor");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === "cnpj") {
      if (value.length <= 18) {
        formattedValue = value
          .replace(/\D/g, "")
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        formattedValue = value.substring(0, 18);
      }
    }

    if (name === "cep") {
      formattedValue = value.replace(/\D/g, "");
      formattedValue = formattedValue.substring(0, 8);
      if (formattedValue.length === 8) {
        formattedValue = formattedValue.replace(/^(\d{5})(\d{3})$/, "$1-$2");
      }
    }

    if (name === "tel") {
      formattedValue = value.replace(/\D/g, "");
      if (/^(\d{2})(\d)/.test(formattedValue)) {
        if (formattedValue.length > 10 && formattedValue[2] === "9") {
          formattedValue = formattedValue.replace(
            /^(\d{2})(\d{5})(\d{4}).*/,
            "($1) $2-$3"
          );
          formattedValue = formattedValue.substring(0, 15);
        } else {
          formattedValue = formattedValue.replace(
            /^(\d{2})(\d{4})(\d{4}).*/,
            "($1) $2-$3"
          );
        }
      }
    }

    setErrors({
      ...errors,
      [name]: "",
    });

    if (content === "produto") {
      setProductData({
        ...productData,
        [name]: formattedValue,
      });
    } else {
      setSupplierData({
        ...supplierData,
        [name]: formattedValue,
      });
    }

    if (name === "cep" && formattedValue.length === 9) {
      try {
        const cepData = await getCep(formattedValue);
        console.log("CEP", cepData);
        if (cepData) {
          if (content === "produto") {
          } else {
            setSupplierData({
              ...supplierData,
              cep: formattedValue,
              address: `${cepData.logradouro} ${cepData.complemento} ${cepData.bairro}`,
              city: cepData.localidade,
              state: cepData.uf,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        setSupplierData({
          ...supplierData,
          address: "",
          city: "",
          state: "",
        });
      }
    }
  };

  const handleSaveSupplier = () => {
    const hasErrors = validateFields();
    if (!hasErrors) {
      const exists = suppliersList.some(
        (supplier) =>
          supplier.name === supplierData.name ||
          supplier.cnpj === supplierData.cnpj
      );
      if (exists) {
        toast.error(
          "Já existe um fornecedor com esse nome ou CNPJ cadastrado",
          {
            className: "custom-toast-error",
          }
        );
      } else {
        const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
        suppliers.push(supplierData);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        setSuppliersList([...suppliersList, supplierData]);
        setSupplierData({
          name: "",
          cnpj: "",
          cep: "",
          tel: "",
          address: "",
          city: "",
          state: "",
          products: [],
        });
        toast.success("Fornecedor cadastrado com sucesso", {
          className: "custom-toast",
        });
        handleCloseModal();
      }
    }
  };

  const handleInputChangeProduct = (
    event:
      | ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setProductData({
      ...productData,
      [name as string]: value as string,
    });
  };

  const handleSaveProduct = () => {
    if (
      !productData.description ||
      !productData.brand ||
      !productData.unitOfMeasurement ||
      !productData.image ||
      !productData.supplier
    ) {
      toast.error(
        "Você precisa preencher todos os campos do produto para salvar",
        {
          className: "custom-toast-error",
        }
      );
      return;
    }

    const existingProduct = JSON.parse(
      localStorage.getItem("products") || "[]"
    ).find(
      (product: any) =>
        product.description === productData.description &&
        product.supplier === productData.supplier
    );

    if (existingProduct) {
      toast.error(
        "Já existe um Produto igual a esse para esse mesmo fornecedor",
        {
          className: "custom-toast-error",
        }
      );
      return;
    }
    const newProduct = { ...productData };
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    if (!newProduct.supplier && suppliersList.length > 0) {
      newProduct.supplier = suppliersList[1].name;
    }

    const selectedSupplierIndex = suppliersList.findIndex(
      (supplier) => supplier.name === newProduct.supplier
    );

    if (selectedSupplierIndex !== -1) {
      suppliersList[selectedSupplierIndex].products.push(newProduct);
      localStorage.setItem("suppliers", JSON.stringify(suppliersList));
    }

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    setProductsList([...productsList, newProduct]);
    setProductData({
      description: "",
      brand: "",
      unitOfMeasurement: "",
      image: "",
      supplier: "",
    });
    setSelectedImage(null);
    toast.success("Produto criado com sucesso", {
      className: "custom-toast",
    });
    handleCloseModal();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData({
        ...productData,
        image: reader.result as string,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    let hasErrors = false;
    const fieldTitles = {
      name: "Nome",
      cnpj: "CNPJ",
      cep: "CEP",
      tel: "Telefone",
      description: "Descrição",
    };
    const newErrors: {
      name: string;
      cnpj: string;
      cep: string;
      tel: string;
      brand: string;
      description: string;
    } = {
      name: "",
      cnpj: "",
      cep: "",
      tel: "",
      brand: "",
      description: "",
    };

    if (content === "produto") {
      Object.entries(productData).forEach(([key, value]) => {
        if (!value) {
          newErrors[key as keyof typeof newErrors] = `${
            fieldTitles[key as keyof typeof fieldTitles]
          } é obrigatório`;
          hasErrors = true;
        }
      });
    } else {
      Object.entries(supplierData).forEach(([key, value]) => {
        if (!value) {
          newErrors[key as keyof typeof newErrors] = `${
            fieldTitles[key as keyof typeof fieldTitles]
          } é obrigatório`;
          hasErrors = true;
        }
      });
    }

    setErrors(newErrors);
    return hasErrors;
  };

  const handleRemoveProduct = (supplierName: string, index: number) => {
    const updatedSuppliersList = [...suppliersList];
    const supplierIndex = updatedSuppliersList.findIndex(
      (supplier) => supplier.name === supplierName
    );

    if (supplierIndex !== -1) {
      updatedSuppliersList[supplierIndex].products.splice(index, 1);
      localStorage.setItem("suppliers", JSON.stringify(updatedSuppliersList));
      const updatedProductsList = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      updatedProductsList.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(updatedProductsList));

      setProductsList(updatedProductsList);
    }
  };

  return (
    <>
      <Menu onItemClick={handleItemClick} />
      <S.Container>
        <>
          <Button
            onClick={
              content === "produto"
                ? handleOpenModalProduct
                : handleOpenModalSupplier
            }
            text={`Cadastrar ${
              content === "produto" ? "Produtos" : "Fornecedor"
            }`}
            disabled={
              content === "produto" && !localStorage.getItem("suppliers")
            }
          />
          {content === "produto" && (
            <>
              {localStorage.getItem("products") ? (
                JSON.parse(localStorage.getItem("products") || "[]").length >
                0 ? (
                  <>
                    <S.Title>Produtos</S.Title>
                    {Object.entries(
                      productsList.reduce((acc: any, product: any) => {
                        if (!acc[product.supplier]) {
                          acc[product.supplier] = [];
                        }
                        acc[product.supplier].push(product);
                        return acc;
                      }, {})
                    ).map(([supplier, products]: any) => (
                      <>
                        <Typography
                          variant="h4"
                          color={"#092d67"}
                          sx={{
                            marginBottom: "30px",
                            marginTop: "30px",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "bold",
                          }}
                        >
                          Produtos do Fornecedor {supplier}
                        </Typography>
                        <Grid container spacing={2}>
                          {products.map((product: any, index: any) => (
                            <Grid
                              item
                              key={index}
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              sx={{ padding: 2 }}
                            >
                              <Card sx={{ maxWidth: 300 }}>
                                <CardMedia
                                  sx={{ height: 140 }}
                                  image={product.image}
                                  title={product.description}
                                />
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    color={"#092d67"}
                                  >
                                    {product.description}
                                  </Typography>
                                  <S.ContainerTypography>
                                    <S.Typography>Marca:</S.Typography>
                                    <Typography color={"#092d67"}>
                                      {product.brand}
                                    </Typography>
                                  </S.ContainerTypography>
                                  <S.ContainerTypography>
                                    <S.Typography>Fornecedor:</S.Typography>
                                    <Typography color={"#092d67"}>
                                      {product.supplier}
                                    </Typography>
                                  </S.ContainerTypography>
                                  <S.ContainerTypography>
                                    <S.Typography>
                                      Unidade de Medida:
                                    </S.Typography>
                                    <Typography color={"#092d67"}>
                                      {product.unitOfMeasurement}
                                    </Typography>
                                  </S.ContainerTypography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <S.Paragraph>
                      Você ainda não tem produtos cadastrados ;(
                    </S.Paragraph>
                    {!localStorage.getItem("suppliers") && (
                      <S.Alert>
                        Para cadastrar algum produto, você deve primeiro criar
                        um fornecedor
                      </S.Alert>
                    )}
                  </>
                )
              ) : (
                <>
                  <S.Paragraph>
                    Você ainda não tem produtos cadastrados ;(
                  </S.Paragraph>
                  {!localStorage.getItem("suppliers") && (
                    <S.Alert>
                      Para cadastrar algum produto, você deve primeiro criar um
                      fornecedor
                    </S.Alert>
                  )}
                </>
              )}
            </>
          )}
        </>
        {content === "fornecedor" && (
          <>
            {localStorage.getItem("suppliers") ? (
              JSON.parse(localStorage.getItem("suppliers") || "[]").length >
              0 ? (
                <>
                  <S.Title>Fornecedores</S.Title>
                  {suppliersList.map((supplier, index) => (
                    <S.ContainerSupplier key={index}>
                      <Typography
                        variant="h4"
                        color={"#092d67"}
                        sx={{
                          marginBottom: "10px",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        {supplier.name}
                      </Typography>
                      <S.ContainerTypography>
                        <S.Typography>CNPJ:</S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.cnpj}
                        </Typography>
                      </S.ContainerTypography>
                      <S.ContainerTypography>
                        <S.Typography>CEP: </S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.cep}
                        </Typography>
                      </S.ContainerTypography>
                      <S.ContainerTypography>
                        <S.Typography>Endereço: </S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.address}
                        </Typography>
                      </S.ContainerTypography>
                      <S.ContainerTypography>
                        <S.Typography>Cidade:</S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.city}
                        </Typography>
                      </S.ContainerTypography>
                      <S.ContainerTypography>
                        <S.Typography>Estado:</S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.state}
                        </Typography>
                      </S.ContainerTypography>
                      <S.ContainerTypography>
                        <S.Typography>Telefone:</S.Typography>
                        <Typography color={"#092d67"}>
                          {" "}
                          {supplier.tel}
                        </Typography>
                      </S.ContainerTypography>

                      <Typography
                        variant="h6"
                        color={"#092d67"}
                        sx={{
                          marginBottom: "10px",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Produtos:
                      </Typography>
                      {supplier.products.length > 0 ? (
                        supplier.products.map((product: any, index: any) => (
                          <S.ContainerProductsList
                            onClick={() =>
                              handleRemoveProduct(supplier.name, index)
                            }
                            key={index}
                          >
                            <S.TypographyProduct>
                              {product.description}
                            </S.TypographyProduct>
                            <S.ContainerClickRemove>
                              <DeleteForeverIcon />
                            </S.ContainerClickRemove>
                          </S.ContainerProductsList>
                        ))
                      ) : (
                        <S.Alert>
                          Não existem produtos cadastrados para esse fornecedor.
                        </S.Alert>
                      )}
                    </S.ContainerSupplier>
                  ))}
                </>
              ) : (
                <S.Paragraph>
                  Você ainda não tem nenhum fornecedor cadastrado, aproveite e
                  já adicione no botão acima.
                </S.Paragraph>
              )
            ) : (
              <S.Paragraph>
                Você ainda não tem nenhum fornecedor cadastrado, aproveite e já
                adicione no botão acima.
              </S.Paragraph>
            )}
          </>
        )}
      </S.Container>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 300, bgcolor: "background.paper", p: 2 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {content === "produto"
              ? "Cadastro de Produto"
              : "Cadastro de Fornecedor"}
          </Typography>
          {content === "produto" && (
            <>
              <TextField
                id="description"
                name="description"
                label="Nome do Produto"
                variant="outlined"
                value={productData.description}
                onChange={handleInputChangeProduct}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.description}
                helperText={errors.description}
              />
              <TextField
                id="brand"
                name="brand"
                label="Marca"
                variant="outlined"
                value={productData.brand}
                onChange={handleInputChangeProduct}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.brand}
                helperText={errors.brand}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <CardMedia
                    component="img"
                    src={URL.createObjectURL(selectedImage)}
                    sx={{ mt: 2, maxWidth: 200 }}
                  />
                )}
              </FormControl>
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <InputLabel id="supplier">Fornecedor</InputLabel>
                <Select
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  labelId="supplier"
                  id="supplier"
                  name="supplier"
                  value={productData.supplier}
                  label="Fornecedor"
                  onChange={handleInputChangeProduct}
                >
                  {localStorage.getItem("suppliers") &&
                    JSON.parse(localStorage.getItem("suppliers") || "[]").map(
                      (supplier: any, index: any) => (
                        <MenuItem key={index} value={supplier.name}>
                          {supplier.name}
                        </MenuItem>
                      )
                    )}
                </Select>
              </div>
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <InputLabel id="supplier">Unidade de Medida</InputLabel>
                <Select
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  labelId="unitOfMeasurement"
                  id="unitOfMeasurement"
                  name="unitOfMeasurement"
                  value={productData.unitOfMeasurement}
                  label="Unidade de Medida"
                  onChange={handleInputChangeProduct}
                >
                  <MenuItem value={"Un (unidade)"}>Un (unidade)</MenuItem>
                  <MenuItem value={"kg (quilograma)"}>kg (quilograma)</MenuItem>
                  <MenuItem value={"m (metro)"}>m (metro)</MenuItem>
                </Select>
              </div>

              <Button onClick={handleSaveProduct} text={"Salvar Produto"} />
            </>
          )}
          {content === "fornecedor" && (
            <>
              <TextField
                id="name"
                name="name"
                label="Nome"
                variant="outlined"
                value={supplierData.name}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                id="cnpj"
                name="cnpj"
                label="CNPJ"
                variant="outlined"
                value={supplierData.cnpj}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.cnpj}
                helperText={errors.cnpj}
              />
              <TextField
                id="cep"
                name="cep"
                label="CEP"
                variant="outlined"
                value={supplierData.cep}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.cep}
                helperText={errors.cep}
              />
              {supplierData.cep.length > 0 && (
                <>
                  <TextField
                    id="address"
                    name="address"
                    label="Endereço"
                    variant="outlined"
                    value={supplierData.address}
                    onChange={handleInputChange}
                    disabled={true}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    id="city"
                    name="city"
                    label="Cidade"
                    variant="outlined"
                    value={supplierData.city}
                    onChange={handleInputChange}
                    disabled={true}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    id="state"
                    name="state"
                    label="Estado"
                    variant="outlined"
                    value={supplierData.state}
                    onChange={handleInputChange}
                    disabled={true}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </>
              )}

              <TextField
                id="tel"
                name="tel"
                label="Telefone"
                variant="outlined"
                value={supplierData.tel}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.tel}
                helperText={errors.tel}
              />
              <Button onClick={handleSaveSupplier} text={"Salvar Fornecedor"} />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Home;
