export const formatCNPJ = (value: string) => {
  if (value.length <= 18) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return value.substring(0, 18);
  }
};

export const formatCEP = (value: string) => {
  let formattedValue = value.replace(/\D/g, "");
  formattedValue = formattedValue.substring(0, 8);
  if (formattedValue.length === 8) {
    return formattedValue.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  }
  return formattedValue;
};

export const formatTel = (value: string) => {
  let formattedValue = value.replace(/\D/g, "");
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
  return formattedValue;
};
