import React, { useState, ChangeEvent, useEffect } from "react";
import { Button, Menu } from "../../components";
import * as S from "./styled";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { getCep } from "../../server/api";

interface Supplier {
  name: string;
  cnpj: string;
  cep: string;
  tel: string;
  address: string;
  city: string;
  state: string;
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
  });
  const [errors, setErrors] = useState({
    name: "",
    cnpj: "",
    cep: "",
    tel: "",
  });
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);

  useEffect(() => {
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    setSuppliersList(suppliers);
  }, []);

  const handleItemClick = (item: string) => {
    setContent(item);
  };

  const handleOpenModal = () => {
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

    setSupplierData({
      ...supplierData,
      [name]: formattedValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "cep" && value.length === 8) {
      try {
        const cepData = await getCep(value);
        if (cepData) {
          setSupplierData({
            ...supplierData,
            address: `${cepData.logradouro} ${cepData.complemento} ${cepData.bairro}`,
            city: cepData.localidade,
            state: cepData.uf,
          });
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
      const supplierWithProducts = {
        ...supplierData,
        products: [] 
      };
      suppliers.push(supplierWithProducts);
      localStorage.setItem("suppliers", JSON.stringify(suppliers));
      setSuppliersList([...suppliersList, supplierWithProducts]);
      setSupplierData({
        name: "",
        cnpj: "",
        cep: "",
        tel: "",
        address: "",
        city: "",
        state: "",
      });
      handleCloseModal();
    }
  };

  const validateFields = () => {
    let hasErrors = false;
    const fieldTitles = {
      name: "Nome",
      cnpj: "CNPJ",
      cep: "CEP",
      tel: "Telefone",
    };
    const newErrors: {
      name: string;
      cnpj: string;
      cep: string;
      tel: string;
    } = { 
      name: "",
      cnpj: "",
      cep: "",
      tel: ""
    };
  
    Object.entries(supplierData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key as keyof typeof newErrors] = `${fieldTitles[key as keyof typeof fieldTitles]} é obrigatório`;
        hasErrors = true;
      }
    });
  
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
                ? () => console.log("TESTE")
                : handleOpenModal
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
          <div key={index}>
            <Typography variant="h6">{supplier.name}</Typography>
            <Typography>CNPJ: {supplier.cnpj}</Typography>
            <Typography>CEP: {supplier.cep}</Typography>
            <Typography>Telefone: {supplier.tel}</Typography>
            <Typography>Endereço: {supplier.address}</Typography>
            <Typography>Cidade: {supplier.city}</Typography>
            <Typography>Estado: {supplier.state}</Typography>
            
          </div>
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
            Cadastro de Fornecedor
          </Typography>
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
          <Button onClick={handleSaveSupplier} text={"Salvar"} />
        </Box>
      </Modal>
    </>
  );
}

export default Home;
