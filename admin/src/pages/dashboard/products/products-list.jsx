import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
  Switch,
  Spinner,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  StarIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { AuthContext, AlertContext } from "@/context";

export function ProductsList() {
  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [imageProduct, setImageProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categories_id: "",
    description: "",
    price_per_kg: "",
    slug: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      addAlert("Klaida gaunant produktus", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Klaida gaunant kategorijas:", err);
    }
  };

  const fetchProductImages = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProductImages(data.images || []);
    } catch (err) {
      console.error("Klaida gaunant nuotraukas:", err);
      setProductImages([]);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        categories_id: product.categories_id?.toString() || "",
        description: product.description || "",
        price_per_kg: product.price_per_kg?.toString() || "",
        slug: product.slug || "",
        sort_order: product.sort_order || 0,
        is_active: product.is_active === 1,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        categories_id: "",
        description: "",
        price_per_kg: "",
        slug: "",
        sort_order: 0,
        is_active: true,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleOpenImageModal = async (product) => {
    setImageProduct(product);
    await fetchProductImages(product.id);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setImageProduct(null);
    setProductImages([]);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      addAlert("Įveskite produkto pavadinimą", "warning");
      return;
    }
    if (!formData.categories_id) {
      addAlert("Pasirinkite kategoriją", "warning");
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase()
      .replace(/[ąčęėįšųūž]/g, c => ({ą:'a',č:'c',ę:'e',ė:'e',į:'i',š:'s',ų:'u',ū:'u',ž:'z'}[c] || c))
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    const payload = {
      ...formData,
      slug,
      categories_id: parseInt(formData.categories_id),
      price_per_kg: parseFloat(formData.price_per_kg) || 0,
      is_active: formData.is_active ? 1 : 0,
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Klaida išsaugant produktą");
      }

      addAlert(
        editingProduct ? "Produktas atnaujintas" : "Produktas sukurtas",
        "success"
      );
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}/toggle-active`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida keičiant statusą");

      addAlert("Produkto statusas pakeistas", "success");
      fetchProducts();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida trinant produktą");

      addAlert("Produktas ištrintas", "success");
      setOpenDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length || !imageProduct) return;

    setUploadingImage(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);
      formData.append("is_main", productImages.length === 0 && i === 0 ? "true" : "false");

      try {
        const res = await fetch(`/api/products/${imageProduct.id}/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Klaida įkeliant nuotrauką");
        }
      } catch (err) {
        addAlert(`Klaida įkeliant ${files[i].name}: ${err.message}`, "error");
      }
    }

    setUploadingImage(false);
    addAlert("Nuotraukos įkeltos", "success");
    await fetchProductImages(imageProduct.id);
    fetchProducts();
    
    // Reset input
    e.target.value = "";
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageProduct) return;

    try {
      const res = await fetch(`/api/products/${imageProduct.id}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida trinant nuotrauką");

      addAlert("Nuotrauka ištrinta", "success");
      await fetchProductImages(imageProduct.id);
      fetchProducts();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const handleSetMainImage = async (imageId) => {
    if (!imageProduct) return;

    try {
      const res = await fetch(`/api/products/${imageProduct.id}/images/${imageId}/main`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida nustatant pagrindinę nuotrauką");

      addAlert("Pagrindinė nuotrauka nustatyta", "success");
      await fetchProductImages(imageProduct.id);
      fetchProducts();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "-";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" color="amber" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Produktų valdymas
              </Typography>
              <Typography variant="small" className="text-blue-gray-600 font-normal mt-1">
                Valdykite savo produktų katalogą
              </Typography>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-gray-400" />
                <Input
                  type="text"
                  placeholder="Ieškoti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 !border-blue-gray-200 focus:!border-amber-500"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[200px]" }}
                />
              </div>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
                onClick={() => handleOpenModal()}
              >
                <PlusIcon className="h-5 w-5" />
                Naujas produktas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr>
                {["Nuotrauka", "Pavadinimas", "Kategorija", "Kaina", "Statusas", "Veiksmai"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const className = `py-3 px-5 ${
                  index === filteredProducts.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={product.id} className="hover:bg-blue-gray-50/50">
                    <td className={className}>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-blue-gray-50">
                        {product.main_image ? (
                          <img
                            src={product.main_image.startsWith('/') || product.main_image.startsWith('http') 
                              ? `http://localhost:3000${product.main_image.startsWith('/') ? '' : '/img/products/'}${product.main_image}`
                              : `http://localhost:3000/img/products/${product.main_image}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-8 h-8 text-blue-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={className}>
                      <div>
                        <Typography className="text-sm font-semibold text-blue-gray-900">
                          {product.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 mt-1 line-clamp-1">
                          {product.description || "Be aprašymo"}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Chip
                        value={getCategoryName(product.categories_id)}
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-900">
                        €{parseFloat(product.price_per_kg || 0).toFixed(2)}/kg
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        value={product.is_active ? "Aktyvus" : "Neaktyvus"}
                        size="sm"
                        color={product.is_active ? "green" : "red"}
                        className="rounded-full"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content={product.is_active ? "Išjungti" : "Įjungti"}>
                          <IconButton
                            variant="text"
                            color={product.is_active ? "amber" : "blue-gray"}
                            onClick={() => handleToggleActive(product)}
                          >
                            {product.is_active ? (
                              <EyeIcon className="h-5 w-5" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Nuotraukos">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleOpenImageModal(product)}
                          >
                            <PhotoIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Redaguoti">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleOpenModal(product)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Ištrinti">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => {
                              setDeletingProduct(product);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="flex items-center justify-center h-32 text-blue-gray-500">
              <Typography>Produktų nerasta</Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={openModal} handler={handleCloseModal} size="lg">
        <DialogHeader>
          {editingProduct ? "Redaguoti produktą" : "Naujas produktas"}
        </DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Pavadinimas *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Select
                label="Kategorija *"
                value={formData.categories_id}
                onChange={(val) => setFormData({ ...formData, categories_id: val })}
              >
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Input
                type="number"
                step="0.01"
                label="Kaina už kg (€)"
                value={formData.price_per_kg}
                onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Aprašymas"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Input
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="pvz: sokoladinis-tortas"
              />
            </div>
            <div>
              <Input
                type="number"
                label="Rūšiavimo tvarka"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  color="green"
                />
                <Typography className="text-sm">
                  Produktas aktyvus (rodomas svetainėje)
                </Typography>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outlined" color="blue-gray" onClick={handleCloseModal}>
            Atšaukti
          </Button>
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-500"
            onClick={handleSubmit}
          >
            {editingProduct ? "Išsaugoti" : "Sukurti"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="sm">
        <DialogHeader>Ištrinti produktą?</DialogHeader>
        <DialogBody>
          <Typography>
            Ar tikrai norite ištrinti produktą "{deletingProduct?.name}"? Šis veiksmas
            negrįžtamas.
          </Typography>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenDeleteModal(false)}>
            Atšaukti
          </Button>
          <Button color="red" onClick={handleDelete}>
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Image Management Modal */}
      <Dialog open={openImageModal} handler={handleCloseImageModal} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <div>
            <Typography variant="h5">
              Nuotraukų valdymas
            </Typography>
            <Typography variant="small" className="text-blue-gray-500 font-normal">
              {imageProduct?.name}
            </Typography>
          </div>
          <IconButton variant="text" onClick={handleCloseImageModal}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[60vh]">
          {/* Upload Area */}
          <div className="mb-6">
            <label
              htmlFor="modal-image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-gray-200 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-all"
            >
              {uploadingImage ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-6 w-6" color="amber" />
                  <Typography className="text-blue-gray-500">Įkeliama...</Typography>
                </div>
              ) : (
                <>
                  <ArrowUpTrayIcon className="w-10 h-10 text-blue-gray-400 mb-2" />
                  <Typography className="text-blue-gray-600 font-medium">
                    Spauskite arba nutempkite nuotraukas
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-400">
                    PNG, JPG, WEBP iki 5MB
                  </Typography>
                </>
              )}
              <input
                type="file"
                id="modal-image-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>

          {/* Images Grid */}
          {productImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {productImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative group rounded-xl overflow-hidden border-2 ${
                    image.is_main ? "border-amber-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={image.image_path.startsWith('/') || image.image_path.startsWith('http')
                      ? `http://localhost:3000${image.image_path.startsWith('/') ? '' : '/img/products/'}${image.image_path}`
                      : `http://localhost:3000/img/products/${image.image_path}`}
                    alt="Produkto nuotrauka"
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Main badge */}
                  {image.is_main === 1 && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <StarIcon className="w-3 h-3" />
                      Pagrindinė
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_main && (
                      <Tooltip content="Nustatyti kaip pagrindinę">
                        <IconButton
                          size="sm"
                          color="amber"
                          onClick={() => handleSetMainImage(image.id)}
                        >
                          <StarIconOutline className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip content="Ištrinti">
                      <IconButton
                        size="sm"
                        color="red"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-blue-gray-400">
              <PhotoIcon className="w-12 h-12 mb-2" />
              <Typography>Nuotraukų nėra</Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="blue-gray" onClick={handleCloseImageModal}>
            Uždaryti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProductsList;
