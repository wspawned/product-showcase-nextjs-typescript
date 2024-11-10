const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price) + " TL" ;
  return formattedPrice;
}

export default formatPrice;