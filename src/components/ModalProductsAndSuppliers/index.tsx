import React, { ChangeEvent } from "react";
import { Button } from "../index";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

interface ModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  content: string;
  productData: any;
  supplierData: any;
  selectedImage: File | null;
  errors: any;
  handleInputChangeProduct: (event: any) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveProduct: () => void;
  handleInputChange: (event: any) => void;
  handleSaveSupplier: () => void;
}

function ModalProductsAndSuppliers({
  openModal,
  handleCloseModal,
  content,
  productData,
  supplierData,
  selectedImage,
  errors,
  handleInputChangeProduct,
  handleImageChange,
  handleSaveProduct,
  handleInputChange,
  handleSaveSupplier,
}: ModalProps): JSX.Element {
  return (
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
      <Box
        sx={{
          width: 300,
          bgcolor: "background.paper",
          p: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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
              <InputLabel id="unitOfMeasurement">Unidade de Medida</InputLabel>
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
  );
}

export default ModalProductsAndSuppliers;
