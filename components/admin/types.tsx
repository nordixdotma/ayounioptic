"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import type { Type } from "@/lib/admin-context"
import { useToast } from "@/hooks/use-toast"

export function Types() {
  const { state, addType, updateType, deleteType } = useAdmin()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<Type | null>(null)
  const [formData, setFormData] = useState({ name: "", image: "" })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File, isEdit = false) => {
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
        setFormData({ ...formData, image: base64 })
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
    setFormData({ name: "", image: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (editFileInputRef.current) editFileInputRef.current.value = ""
  }

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du type est requis.",
        variant: "destructive",
      })
      return
    }

    if (!formData.image) {
      toast({
        title: "Erreur",
        description: "Une image est requise.",
        variant: "destructive",
      })
      return
    }

    addType({ name: formData.name.trim(), image: formData.image })
    resetForm()
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Type ajouté avec succès.",
    })
  }

  const handleEdit = (type: Type) => {
    setEditingType(type)
    setFormData({ name: type.name, image: type.image })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingType) return

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du type est requis.",
        variant: "destructive",
      })
      return
    }

    if (!formData.image) {
      toast({
        title: "Erreur",
        description: "Une image est requise.",
        variant: "destructive",
      })
      return
    }

    updateType({ ...editingType, name: formData.name.trim(), image: formData.image })
    resetForm()
    setEditingType(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Succès",
      description: "Type mis à jour avec succès.",
    })
  }

  const handleDelete = (id: number) => {
    const productsCount = state.products.filter((p) => p.typeId === id).length
    deleteType(id)
    toast({
      title: "Succès",
      description: `Type supprimé${productsCount > 0 ? ` avec ${productsCount} produit(s)` : ""}.`,
    })
  }

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
                  {formData.image && (
                    <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.image || "/placeholder.svg"}
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
              <Label htmlFor="edit-image">Image du type</Label>
              <div className="space-y-2">
                <Input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, true)
                  }}
                  disabled={isUploading}
                />
                {formData.image && (
                  <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image || "/placeholder.svg"}
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
