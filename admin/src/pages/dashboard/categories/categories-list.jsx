import { buildApiUrl } from '../../../utils/api.js';
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
  Spinner,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { AuthContext, AlertContext } from "@/context";

// Populiarūs emoji maistui/konditerijos produktams
const EMOJI_OPTIONS = [
  "🎂", "🍰", "🧁", "🍪", "🥧", "🍩", "🥐", "🍞", 
  "🥨", "🥯", "🧇", "🥞", "🍫", "🍬", "🍭", "🍮",
  "🍯", "🎀", "🍨", "🍦", "☕", "🍵", "🥛", "🧈",
  "🍓", "🍒", "🍎", "🍋", "🥝", "🍊", "🫐", "🍇",
  "🌰", "🥜", "🍿", "🧀", "🥚", "🌾", "🌻", "🎁",
  "❤️", "⭐", "✨", "🔥", "💫", "🌟", "💝", "🎉"
];

export function CategoriesList() {
  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "🎂",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/categories'));
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      addAlert("Klaida gaunant kategorijas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        image: category.image || "🎂",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "🎂",
      });
    }
    setOpenEmojiPicker(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
    setOpenEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      addAlert("Pavadinimas yra privalomas", "warning");
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase()
      .replace(/[ąčęėįšųūž]/g, c => ({ą:'a',č:'c',ę:'e',ė:'e',į:'i',š:'s',ų:'u',ū:'u',ž:'z'}[c] || c))
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    const payload = {
      ...formData,
      slug,
    };

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}` 
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(buildApiUrl(url), {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Klaida išsaugant kategoriją");

      addAlert(
        editingCategory ? "Kategorija atnaujinta" : "Kategorija sukurta",
        "success"
      );
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  const selectEmoji = (emoji) => {
    setFormData({ ...formData, image: emoji });
    setOpenEmojiPicker(false);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      const res = await fetch(buildApiUrl(`/api/categories/${deletingCategory.id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Klaida trinant kategoriją");

      addAlert("Kategorija ištrinta", "success");
      setOpenDeleteModal(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      addAlert(err.message, "error");
    }
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
                Kategorijų valdymas
              </Typography>
              <Typography variant="small" className="text-blue-gray-600 font-normal mt-1">
                Valdykite produktų kategorijas
              </Typography>
            </div>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={() => handleOpenModal()}
            >
              <PlusIcon className="h-5 w-5" />
              Nauja kategorija
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[600px] table-auto">
            <thead>
              <tr>
                {["Emoji", "Pavadinimas", "Slug", "Aprašymas", "Veiksmai"].map((el) => (
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
              {categories.map((category, index) => {
                const className = `py-3 px-5 ${
                  index === categories.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={category.id} className="hover:bg-blue-gray-50/50">
                    <td className={className}>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl shadow-sm">
                        {category.image || "🎂"}
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-900">
                        {category.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        value={category.slug || "-"}
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-sm text-blue-gray-600 line-clamp-2 max-w-xs">
                        {category.description || "-"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Redaguoti">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleOpenModal(category)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Ištrinti">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => {
                              setDeletingCategory(category);
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

          {categories.length === 0 && (
            <div className="flex items-center justify-center h-32 text-blue-gray-500">
              <Typography>Kategorijų nerasta</Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={openModal} handler={handleCloseModal} size="md">
        <DialogHeader>
          {editingCategory ? "Redaguoti kategoriją" : "Nauja kategorija"}
        </DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-4">
            <Input
              label="Pavadinimas *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="pvz: gimtadienio-tortai"
            />
            <Textarea
              label="Aprašymas"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            
            {/* Emoji Section */}
            <div>
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-700">
                Emoji
              </Typography>
              
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-amber-400"
                >
                  {formData.image || "🎂"}
                </button>
                <div className="flex flex-col">
                  <Typography variant="small" className="text-blue-gray-600">
                    Pasirinktas emoji
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-400">
                    Spausk ant emoji norėdamas keisti
                  </Typography>
                </div>
              </div>

              {openEmojiPicker && (
                <div className="mt-4 p-4 bg-blue-gray-50 rounded-xl">
                  <Typography variant="small" className="mb-3 font-medium text-blue-gray-700">
                    Pasirink emoji:
                  </Typography>
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectEmoji(emoji)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl hover:bg-amber-100 transition-all hover:scale-110 ${
                          formData.image === emoji ? "bg-amber-200 ring-2 ring-amber-500" : "bg-white"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-gray-200">
                    <Typography variant="small" className="mb-2 text-blue-gray-600">
                      Arba įvesk savo emoji:
                    </Typography>
                    <Input
                      size="md"
                      placeholder="🎂"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="!text-2xl text-center"
                      containerProps={{ className: "!w-24" }}
                    />
                  </div>
                </div>
              )}
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
            {editingCategory ? "Išsaugoti" : "Sukurti"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="sm">
        <DialogHeader>Ištrinti kategoriją?</DialogHeader>
        <DialogBody>
          <Typography>
            Ar tikrai norite ištrinti kategoriją "{deletingCategory?.name}"? Šis veiksmas
            negrįžtamas ir gali paveikti susijusius produktus.
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
    </div>
  );
}

export default CategoriesList;
