"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/lib/admin-context"
import { useAdmin } from "@/lib/admin-context"
import {
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  updateCategory as apiUpdateCategory,
  fetchCategories,
} from "@/lib/api/categories"
import { Edit, ImageIcon, Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function Categories() {
  const { state, dispatch } = useAdmin()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    imagePreview: string
    imageFile: File | null
  }>({ name: "", imagePreview: "", imageFile: null })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData({ ...formData, imagePreview: base64, imageFile: file })
        setIsUploading(false)
        toast({
          title: "Succès",
          description: "Image téléchargée avec succès.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ name: "", imagePreview: "", imageFile: null })
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (editFileInputRef.current) editFileInputRef.current.value = ""
  }

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis.",
        variant: "destructive",
      })
      return
    }

    if (!formData.imageFile) {
      toast({
        title: "Erreur",
        description: "Une image est requise.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const newCategory = await apiCreateCategory({
        name: formData.name.trim(),
        image: formData.imageFile,
      })
      dispatch({ type: "ADD_CATEGORY", payload: newCategory })
      resetForm()
      setIsAddDialogOpen(false)
      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la catégorie.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, imagePreview: category.image, imageFile: null })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingCategory) return

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const updated = await apiUpdateCategory({
        id: editingCategory.id,
        name: formData.name.trim(),
        image: formData.imageFile || undefined,
      })
      dispatch({ type: "UPDATE_CATEGORY", payload: updated })
      resetForm()
      setEditingCategory(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de la catégorie.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const productsCount = state.products.filter((p) => p.categoryId === id).length
    try {
      await apiDeleteCategory(id)
      dispatch({ type: "DELETE_CATEGORY", payload: id })
      toast({
        title: "Succès",
        description: `Catégorie supprimée${productsCount > 0 ? ` avec ${productsCount} produit(s)` : ""}.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de la catégorie.",
        variant: "destructive",
      })
    }
  }

  // Charger les catégories depuis l'API au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories()
        dispatch({ type: "SET_CATEGORIES", payload: cats })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories depuis le serveur.",
          variant: "destructive",
        })
      }
    }
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Catégories</h2>
          <p className="text-slate-600">Gérez les catégories de vos produits</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#415b58] hover:bg-[#415b58]/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
              <DialogDescription>Créez une nouvelle catégorie pour organiser vos produits.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Homme, Femme"
                />
              </div>
              <div>
                <Label htmlFor="image">Image de la catégorie</Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={isUploading}
                  />
                  {formData.imagePreview && (
                    <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAdd} disabled={isUploading} className="bg-[#415b58] hover:bg-[#415b58]/90">
                {isUploading ? "Téléchargement..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.categories.map((category) => (
          <Card key={category.id} className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                {category.image ? (
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>
                {state.products.filter((p) => p.categoryId === category.id).length} produit(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les produits associés seront également
                        supprimés. Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {state.categories.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune catégorie</h3>
          <p className="text-slate-500">Commencez par ajouter votre première catégorie.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez les informations de cette catégorie.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom de la catégorie</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Homme, Femme"
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image de la catégorie</Label>
              <div className="space-y-2">
                <Input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  disabled={isUploading}
                />
                {formData.imagePreview && (
                  <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} disabled={isUploading} className="bg-[#415b58] hover:bg-[#415b58]/90">
              {isUploading ? "Téléchargement..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
