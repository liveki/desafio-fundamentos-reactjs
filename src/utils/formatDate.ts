const formatDate = (value: Date): string =>
  new Date(value).toLocaleDateString('pt-BR');

export default formatDate;
