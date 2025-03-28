import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";

const ManageProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleDeleteProduct = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Deleted!", "The product has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Error!",
          error?.data?.message || "Failed to delete product. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 font-semibold">
                <th className="p-4 border border-gray-300">#</th>
                <th className="p-4 border border-gray-300">Product ID</th>
                <th className="p-4 border border-gray-300">Product</th>
                <th className="p-4 border border-gray-300">Category</th>
                <th className="p-4 border border-gray-300">Colors</th>
                <th className="p-4 border border-gray-300">Price</th>
                <th className="p-4 border border-gray-300">Stock</th>
                <th className="p-4 border border-gray-300">Actions</th>
              </tr>
            </thead>
  
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="8" className="text-center p-6 border border-gray-300">
                    Loading products...
                  </td>
                </tr>
              )}
  
              {!isLoading && products?.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id} className="hover:bg-gray-100 transition">
                    {/* Index */}
                    <td className="p-4 border border-gray-300 align-middle">{index + 1}</td>
  
                    {/* Product ID */}
                    <td className="p-4 border border-gray-300 align-middle text-sm text-gray-600">
                      {product._id.slice(0, 8)}...
                    </td>
  
                    {/* Product Image + Title */}
                    <td className="p-4 border border-gray-300">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImgUrl(product.coverImage)}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <span className="font-medium text-gray-800">{product.title}</span>
                      </div>
                    </td>
  
                    {/* Category */}
                    <td className="p-4 border border-gray-300 align-middle capitalize text-gray-700">
                      {["Men", "Women", "Children"].includes(product.category)
                        ? product.category
                        : "Uncategorized"}
                    </td>
  
                    {/* Colors with Flex Wrap and Sorted */}
                    <td className="p-4 border border-gray-300 align-middle">
  <div className="flex flex-wrap items-center gap-4">
  {product.colors?.length > 0 ? (
  [...product.colors]
    .sort((a, b) => a.colorName.localeCompare(b.colorName))
    .map((color, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: color.hex || "#fff" }}
        />
        <span className="text-sm text-gray-700">{color.colorName}</span>
      </div>
    ))
) : (
  <span className="text-gray-500">Default</span>
)}

  </div>
</td>

  
                    {/* Price */}
                    <td className="p-4 border border-gray-300 align-middle text-green-600 font-semibold">
                      ${product.newPrice}
                    </td>
  
                    {/* Stock */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <span
                        className={
                          product.stockQuantity === 0
                            ? "text-red-500 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
  
                    {/* Actions */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <div className="flex flex-col items-center gap-2">
                        <Link
                          to={`/dashboard/edit-product/${product._id}`}
                          className="bg-blue-500 text-white px-4 py-1 rounded font-medium hover:bg-blue-700 w-24 text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deleting}
                          className="bg-red-500 text-white px-4 py-1 rounded font-medium hover:bg-red-700 w-24"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan="8" className="text-center p-6 border border-gray-300">
                      No products found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
  
};  

export default ManageProducts;
