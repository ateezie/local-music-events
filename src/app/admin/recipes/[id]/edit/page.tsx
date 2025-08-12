'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import { Recipe, Ingredient } from '@/types/recipe'

const categories = [
  'appetizers',
  'main-course', 
  'side-dishes',
  'desserts',
  'beverages',
  'snacks',
  'breakfast',
  'quick-meals'
]

const difficulties = ['easy', 'medium', 'hard'] as const

export default function EditRecipe() {
  const router = useRouter()
  const params = useParams()
  const recipeId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy' as const,
    prepTime: 0,
    cookTime: 0,
    servings: 4,
    image: '',
    tags: '',
    chefName: '',
    chefAvatar: '',
    calories: 0,
    protein: '',
    carbs: '',
    fat: '',
    featured: false
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [instructions, setInstructions] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    loadRecipe()
  }, [recipeId, router])

  const loadRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`)
      const data = await response.json()

      if (response.ok) {
        const recipe = data.recipe
        setRecipe(recipe)
        setFormData({
          title: recipe.title,
          description: recipe.description,
          category: recipe.category,
          difficulty: recipe.difficulty,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          image: recipe.image,
          tags: recipe.tags.join(', '),
          chefName: recipe.chef.name,
          chefAvatar: recipe.chef.avatar,
          calories: recipe.nutrition.calories,
          protein: recipe.nutrition.protein,
          carbs: recipe.nutrition.carbs,
          fat: recipe.nutrition.fat,
          featured: recipe.featured
        })
        setIngredients(recipe.ingredients)
        setInstructions(recipe.instructions)
      } else {
        setError('Recipe not found')
      }
    } catch (error) {
      setError('Error loading recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const updatedRecipe = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.category,
        difficulty: formData.difficulty,
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        totalTime: formData.prepTime + formData.cookTime,
        servings: formData.servings,
        image: formData.image,
        featured: formData.featured,
        chef: {
          name: formData.chefName,
          avatar: formData.chefAvatar
        },
        nutrition: {
          calories: formData.calories,
          protein: formData.protein,
          carbs: formData.carbs,
          fat: formData.fat
        },
        ingredients,
        instructions,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedRecipe)
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'Error saving recipe')
      }
    } catch (error) {
      setError('Error saving recipe')
    } finally {
      setSaving(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { item: '', amount: '' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: 'item' | 'amount', value: string) => {
    const updated = ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    )
    setIngredients(updated)
  }

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((inst, i) => 
      i === index ? value : inst
    )
    setInstructions(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-chang-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-chang-brown-600">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error && !recipe) {
    return (
      <div className="min-h-screen bg-chang-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/admin/dashboard"
            className="text-chang-orange-600 hover:text-chang-orange-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chang-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-chang-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MusicLogo className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-chang-brown-800">
                Edit Recipe: {recipe?.title}
              </h1>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-chang-brown-600 hover:text-chang-brown-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-chang-brown-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Difficulty *
                </label>
                <select
                  required
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Servings *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.servings}
                  onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Prep Time (minutes) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.prepTime}
                  onChange={(e) => setFormData({...formData, prepTime: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Cook Time (minutes) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.cookTime}
                  onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="quick, healthy, gluten-free"
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2 rounded border-chang-neutral-300 text-chang-orange-600 focus:ring-chang-orange-500"
                  />
                  <span className="text-sm font-medium text-chang-brown-700">Featured Recipe</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-chang-brown-800">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                className="bg-chang-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-chang-orange-700"
              >
                Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Amount (e.g., 1 cup)"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="w-1/3 px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                    className="flex-1 px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-700 px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-chang-brown-800">Instructions</h3>
              <button
                type="button"
                onClick={addInstruction}
                className="bg-chang-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-chang-orange-700"
              >
                Add Step
              </button>
            </div>
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <span className="mt-2 text-sm font-medium text-chang-brown-600 min-w-[2rem]">
                    {index + 1}.
                  </span>
                  <textarea
                    rows={2}
                    placeholder="Describe this step..."
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-600 hover:text-red-700 px-2 mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chef & Nutrition */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-chang-brown-800 mb-4">Chef & Nutrition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Chef Name
                </label>
                <input
                  type="text"
                  value={formData.chefName}
                  onChange={(e) => setFormData({...formData, chefName: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Chef Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.chefAvatar}
                  onChange={(e) => setFormData({...formData, chefAvatar: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Protein
                </label>
                <input
                  type="text"
                  placeholder="e.g., 25g"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Carbs
                </label>
                <input
                  type="text"
                  placeholder="e.g., 40g"
                  value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                  Fat
                </label>
                <input
                  type="text"
                  placeholder="e.g., 12g"
                  value={formData.fat}
                  onChange={(e) => setFormData({...formData, fat: e.target.value})}
                  className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chang-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-chang-brown-600 border border-chang-brown-300 rounded-md hover:bg-chang-brown-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-chang-orange-600 text-white rounded-md hover:bg-chang-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}