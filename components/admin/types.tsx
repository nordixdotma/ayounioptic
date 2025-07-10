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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Type } from "@/lib/admin-context"
import { useAdmin } from "@/lib/admin-context"
import {
  createSousCategory as apiCreateSousCategory,
  deleteSousCategory as apiDeleteSousCategory,
  updateSousCategory as apiUpdateSousCategory,
  fetchSousCategories,
} from "@/lib/api/sousCategories"
import { Edit, ImageIcon, Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function Types() {
  const { state, dispatch } = useAdmin()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<Type | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    imagePreview: string
    imageFile: File | null
    categoryId: number | ""
  }>({ name: "", imagePreview: "", imageFile: null, categoryId: "" })
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
    setFormData({ name: "", imagePreview: "", imageFile: null, categoryId: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (editFileInputRef.current) editFileInputRef.current.value = ""
  }

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du type est requis.",
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

    if (formData.categoryId === "") {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const categoryId = formData.categoryId as number
      const newSousCat = await apiCreateSousCategory({
        name: formData.name.trim(),
        image: formData.imageFile,
        categoryId,
      })
      dispatch({ type: "ADD_TYPE", payload: { id: newSousCat.id, name: newSousCat.name, image: newSousCat.image, categoryId } })
      resetForm()
      setIsAddDialogOpen(false)
      toast({ title: "Succès", description: "Type ajouté avec succès." })
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'ajout du type.", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (type: Type) => {
    setEditingType(type)
    setFormData({ name: type.name, imagePreview: type.image, imageFile: null, categoryId: type.categoryId })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingType) return

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du type est requis.",
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

    if (formData.categoryId === "") {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const updatedSousCat = await apiUpdateSousCategory({
        id: editingType.id,
        name: formData.name.trim(),
        image: formData.imageFile || undefined,
        categoryId: formData.categoryId as number,
      })
      dispatch({ type: "UPDATE_TYPE", payload: { id: updatedSousCat.id, name: updatedSousCat.name, image: updatedSousCat.image, categoryId: formData.categoryId as number } })
      resetForm()
      setEditingType(null)
      setIsEditDialogOpen(false)
      toast({ title: "Succès", description: "Type mis à jour avec succès." })
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la mise à jour du type.", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const productsCount = state.products.filter((p) => p.typeId === id).length
    try {
      await apiDeleteSousCategory(id)
      dispatch({ type: "DELETE_TYPE", payload: id })
      toast({
        title: "Succès",
        description: `Type supprimé${productsCount > 0 ? ` avec ${productsCount} produit(s)` : ""}.`,
      })
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression du type.", variant: "destructive" })
    }
  }

  // Charger les types depuis l'API (sousCategories)
  useEffect(() => {
    const loadSousCats = async () => {
      try {
        const sousCats = await fetchSousCategories()
        const mapped = sousCats.map((s) => ({ id: s.id, name: s.name, image: s.image, categoryId: s.categoryId }))
        dispatch({ type: "SET_TYPES", payload: mapped })
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les types.", variant: "destructive" })
      }
    }
    loadSousCats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Types</h2>
          <p className="text-slate-600">Gérez les types de vos produits</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#415b58] hover:bg-[#415b58]/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau type</DialogTitle>
              <DialogDescription>Créez un nouveau type pour organiser vos produits.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du type</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Vue, Soleil"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={String(formData.categoryId)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value === "" ? "" : Number(value) })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image du type</Label>
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
        {state.types.map((type) => (
          <Card key={type.id} className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                {type.image ? (
                  <img src={type.image || "/placeholder.svg"} alt={type.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{type.name}</CardTitle>
              <CardDescription>{state.products.filter((p) => p.typeId === type.id).length} produit(s)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(type)} className="flex-1">
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
                      <AlertDialogTitle>Supprimer le type</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce type ? Tous les produits associés seront également
                        supprimés. Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(type.id)} className="bg-red-600 hover:bg-red-700">
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

      {state.types.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun type</h3>
          <p className="text-slate-500">Commencez par ajouter votre premier type.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type</DialogTitle>
            <DialogDescription>Modifiez les informations de ce type.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom du type</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Vue, Soleil"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Catégorie</Label>
              <Select
                value={String(formData.categoryId)}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value === "" ? "" : Number(value) })
                }
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {state.categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-image">Image du type</Label>
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
