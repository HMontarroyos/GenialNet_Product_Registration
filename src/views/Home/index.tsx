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
  brand: string;
  unitOfMeasurement: string;
  image: string;
}

function Home() {
  const [content, setContent] = useState("produto");
  const [openModal, setOpenModal] = useState(false);
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
  });
  const [errors, setErrors] = useState({
    name: "",
    cnpj: "",
    cep: "",
    tel: "",
    price: "",
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

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "cep" && value.length === 8) {
      try {
        const cepData = await getCep(value);
        if (cepData) {
          if (content === "produto") {
          } else {
            setSupplierData({
              ...supplierData,
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
  };

  const handleSaveProduct = () => {};

  const validateFields = () => {
    let hasErrors = false;
    const fieldTitles = {
      name: "Nome",
      cnpj: "CNPJ",
      cep: "CEP",
      tel: "Telefone",
      price: "Preço",
      description: "Descrição",
    };
    const newErrors: {
      name: string;
      cnpj: string;
      cep: string;
      tel: string;
      price: string;
      description: string;
    } = {
      name: "",
      cnpj: "",
      cep: "",
      tel: "",
      price: "",
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
            /* disabled */
          />
          {content === "produto" && (
            <>
              <S.Paragraph>
                Você ainda não tem produtos cadastrados ;(
              </S.Paragraph>
              <S.Alert>
                Para cadastrar algum produto, você deve primeiro criar um
                fornecedor
              </S.Alert>
            </>
          )}
        </>
        {content === "fornecedor" && (
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
                  <Typography color={"#092d67"}> {supplier.cnpj}</Typography>
                </S.ContainerTypography>
                <S.ContainerTypography>
                  <S.Typography>CEP: </S.Typography>
                  <Typography color={"#092d67"}> {supplier.cep}</Typography>
                </S.ContainerTypography>
                <S.ContainerTypography>
                  <S.Typography>Endereço: </S.Typography>
                  <Typography color={"#092d67"}> {supplier.address}</Typography>
                </S.ContainerTypography>
                <S.ContainerTypography>
                  <S.Typography>Cidade:</S.Typography>
                  <Typography color={"#092d67"}> {supplier.city}</Typography>
                </S.ContainerTypography>
                <S.ContainerTypography>
                  <S.Typography>Estado:</S.Typography>
                  <Typography color={"#092d67"}> {supplier.state}</Typography>
                </S.ContainerTypography>
                <S.ContainerTypography>
                  <S.Typography>Telefone:</S.Typography>
                  <Typography color={"#092d67"}> {supplier.tel}</Typography>
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
                      onClick={() => console.log("EXCLUIR")}
                    >
                      <S.TypographyProduct>Banana</S.TypographyProduct>
                      <S.ContainerClickRemove>
                        <DeleteForeverIcon />
                      </S.ContainerClickRemove>
                    </S.ContainerProductsList>
                  ))
                ) : (
                  <S.Alert>
                    Não existe produtos cadastrado para esse fornecedor, caso
                    deseje cadastre na página de produtos
                  </S.Alert>
                )}
              </S.ContainerSupplier>
            ))}
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
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.description}
                helperText={errors.description}
              />

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
