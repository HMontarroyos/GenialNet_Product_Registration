import React, { useState, ChangeEvent, useEffect } from "react";
import { getCep } from "../../server/api";
import { Button, Menu, ModalProductsAndSuppliers } from "../../components";
import * as S from "./styled";
import "./style.css";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import {
  Product,
  Supplier,
  errorsEmpty,
  messageSupplierEmpty,
  productDataEmpty,
  supplierDataEmpty,
} from "../../global/const";
import { formatCEP, formatCNPJ, formatTel } from "../../utils";

function Home() {
  const [content, setContent] = useState("produto");
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [supplierData, setSupplierData] = useState<Supplier>(supplierDataEmpty);
  const [productData, setProductData] = useState<Product>(productDataEmpty);
  const [errors, setErrors] = useState(errorsEmpty);
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

  const handleOpenModal = (content: string) => {
    setContent(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    if (name === "cep") {
      formattedValue = formatCEP(value);
    }

    if (name === "tel") {
      formattedValue = formatTel(value);
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
        setSupplierData(supplierDataEmpty);
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
    try {
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

      const existingProduct = productsList.find(
        (product) =>
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
      const supplier = suppliersList.find(
        (supplier) => supplier.name === newProduct.supplier
      );

      if (supplier) {
        const updatedSupplier = {
          ...supplier,
          products: [...supplier.products, newProduct],
        };
        const updatedSuppliersList = suppliersList.map((item) =>
          item.name === updatedSupplier.name ? updatedSupplier : item
        );
        localStorage.setItem("suppliers", JSON.stringify(updatedSuppliersList));
        setSuppliersList(updatedSuppliersList);
      } else {
        toast.error("Fornecedor não encontrado", {
          className: "custom-toast-error",
        });
        return;
      }

      const updatedProductsList = [...productsList, newProduct];
      localStorage.setItem("products", JSON.stringify(updatedProductsList));

      setProductsList(updatedProductsList);
      setProductData(productDataEmpty);
      setSelectedImage(null);
      toast.success("Produto criado com sucesso", {
        className: "custom-toast",
      });
      handleCloseModal();
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao salvar o produto, possivelmente o storage está cheio, exclua algum produto para liberar espaço no bd",
        {
          className: "custom-toast-error",
        }
      );
      console.error("Erro ao salvar o produto,", error);
    }
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
    } = errorsEmpty;

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

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <S.ContainerTypography>
      <S.Typography>{label}</S.Typography>
      <Typography color={"#092d67"}>{value}</Typography>
    </S.ContainerTypography>
  );

  const NoProductsMessage = () => (
    <>
      <S.Paragraph>Você ainda não tem produtos cadastrados ;(</S.Paragraph>
      {!localStorage.getItem("suppliers") && (
        <S.Alert>
          Para cadastrar algum produto, você deve primeiro criar um fornecedor
        </S.Alert>
      )}
    </>
  );

  return (
    <>
      <Menu onItemClick={handleItemClick} />
      <S.Container>
        <>
          <Button
            onClick={() => handleOpenModal(content)}
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
                                  <InfoItem
                                    label="Marca:"
                                    value={product.brand}
                                  />
                                  <InfoItem
                                    label="Fornecedor:"
                                    value={product.supplier}
                                  />
                                  <InfoItem
                                    label="Unidade de Medida:"
                                    value={product.unitOfMeasurement}
                                  />
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ))}
                  </>
                ) : (
                  <NoProductsMessage />
                )
              ) : (
                <NoProductsMessage />
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
                      <InfoItem label="CNPJ:" value={supplier.cnpj} />
                      <InfoItem label="CEP:" value={supplier.cep} />
                      <InfoItem label="Endereço:" value={supplier.address} />
                      <InfoItem label="Cidade:" value={supplier.city} />
                      <InfoItem label="Estado:" value={supplier.state} />
                      <InfoItem label="Telefone:" value={supplier.tel} />
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
                <S.Paragraph>{messageSupplierEmpty}</S.Paragraph>
              )
            ) : (
              <S.Paragraph>{messageSupplierEmpty}</S.Paragraph>
            )}
          </>
        )}
      </S.Container>

      <ModalProductsAndSuppliers
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        content={content}
        productData={productData}
        selectedImage={selectedImage}
        supplierData={supplierData}
        errors={errors}
        handleInputChangeProduct={handleInputChangeProduct}
        handleImageChange={handleImageChange}
        handleSaveProduct={handleSaveProduct}
        handleInputChange={handleInputChange}
        handleSaveSupplier={handleSaveSupplier}
      />
    </>
  );
}

export default Home;
