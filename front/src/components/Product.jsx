const Product = ({ data }) => {
  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 border">{data.id}</td>
      <td className="px-4 py-2 border">{data.name}</td>
      <td className="px-4 py-2 border">{data.description}</td>
      <td className="px-4 py-2 border">{new Date(data.publish_date).toLocaleDateString('lt-LT')}</td>
    </tr>
  );
};

export default Product;