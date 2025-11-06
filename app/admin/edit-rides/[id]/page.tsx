"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import RichTextEditor from "@/components/admin/rich-text-editor"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon,
  Search,
  Clock,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Mountain,
  Route,
  Navigation,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Heart,
  Camera,
  Video,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  BarChart,
  TrendingUp,
  Flame,
  Droplet,
  Sun,
  Moon,
  Wind,
  Cloud,
  Umbrella,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Gift,
  ShoppingBag,
  Package,
  Truck,
  Car,
  Bike,
  Train,
  Plane,
  Ship,
  Home,
  Building,
  Map,
  Compass,
  Flag,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Download,
  Upload as UploadIcon,
  FileText,
  File,
  Folder,
  FolderOpen,
  Image,
  Music,
  Film,
  Book,
  BookOpen,
  GraduationCap,
  Briefcase,
  Coffee,
  Utensils,
  ShoppingCart,
  CreditCard,
  Banknote,
  Wallet,
  PiggyBank,
  Coins,
  TrendingDown,
  Minus,
  Plus as PlusIcon,
  Check,
  XCircle,
  AlertTriangle,
  Wifi,
  Bluetooth,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  type LucideIcon
} from "lucide-react"

interface RideInfo {
  id: string
  icon: string
  question: string
  answer: string
}

interface GalleryPhoto {
  id: string
  photo_url: string
}

function EditRidesContent() {
  const router = useRouter()
  const params = useParams()
  const rideId = params?.id as string
  const { isCollapsed } = useSidebar()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  // Step 1: Basic Info
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"group" | "personal">("group")
  const [originalPrice, setOriginalPrice] = useState("")
  const [finalPrice, setFinalPrice] = useState("")
  
  // Icon dropdown state
  const [openIconDropdowns, setOpenIconDropdowns] = useState<Record<string, boolean>>({})
  const [iconSearchQueries, setIconSearchQueries] = useState<Record<string, string>>({})
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openIconDropdowns).forEach((infoId) => {
        const dropdown = dropdownRefs.current[infoId]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenIconDropdowns(prev => ({ ...prev, [infoId]: false }))
        }
      })
    }

    if (Object.values(openIconDropdowns).some(isOpen => isOpen)) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [openIconDropdowns])
  
  // Step 2: Images & Location
  const [primaryPicture, setPrimaryPicture] = useState<File | null>(null)
  const [primaryPicturePreview, setPrimaryPicturePreview] = useState<string>("")
  const [secondaryPicture, setSecondaryPicture] = useState<File | null>(null)
  const [secondaryPicturePreview, setSecondaryPicturePreview] = useState<string>("")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")
  const [meetingPoint, setMeetingPoint] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState("")
  const [whatsappMessage, setWhatsappMessage] = useState("")
  
  // Step 3: Ride Infos
  const [rideInfos, setRideInfos] = useState<RideInfo[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([])
  const [galleryPhotoCount, setGalleryPhotoCount] = useState<number>(1)
  
  // Store original files for later upload with rename
  const [primaryPictureFile, setPrimaryPictureFile] = useState<File | null>(null)
  const [secondaryPictureFile, setSecondaryPictureFile] = useState<File | null>(null)
  const [galleryPhotoFiles, setGalleryPhotoFiles] = useState<Record<string, File>>({})

  // Load data
  useEffect(() => {
    if (rideId) {
      fetchRideData()
    }
  }, [rideId])

  const fetchRideData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch ride data
      const { data: rideData, error: rideError } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single()

      if (rideError) {
        throw rideError
      }

      if (rideData) {
        // Set basic fields
        setTitle(rideData.title || "")
        setTags(rideData.tags || [])
        setShortDescription(rideData.short_description || "")
        setDescription(rideData.description || "")
        setType(rideData.type || "group")
        setOriginalPrice(rideData.original_price ? rideData.original_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : "")
        setFinalPrice(rideData.final_price ? rideData.final_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : "")
        setPrimaryPicturePreview(rideData.primary_picture || "")
        setSecondaryPicturePreview(rideData.secondary_picture || "")
        setDuration(rideData.duration || "")
        setLocation(rideData.location || "")
        setMeetingPoint(rideData.meeting_point || "")
        setDifficultyLevel(rideData.difficulty_level || "")
        setWhatsappMessage(rideData.whatsapp_message || "")

        // Fetch ride_infos
        const { data: infosData, error: infosError } = await supabase
          .from('ride_infos')
          .select('*')
          .eq('ride_id', rideId)
          .order('display_order', { ascending: true })

        if (infosError) {
          console.error('Error fetching ride_infos:', infosError)
        } else if (infosData && infosData.length > 0) {
          const formattedInfos = infosData.map(info => ({
            id: info.id,
            icon: info.icon || "",
            question: info.question || "",
            answer: info.answer || ""
          }))
          setRideInfos(formattedInfos)
        }

        // Fetch gallery photos
        const { data: galleryData, error: galleryError } = await supabase
          .from('ride_gallery_photos')
          .select('*')
          .eq('ride_id', rideId)
          .order('display_order', { ascending: true })

        if (galleryError) {
          console.error('Error fetching gallery photos:', galleryError)
        } else if (galleryData && galleryData.length > 0) {
          const formattedPhotos = galleryData.map(photo => ({
            id: photo.id,
            photo_url: photo.photo_url || ""
          }))
          setGalleryPhotos(formattedPhotos)
          setGalleryPhotoCount(galleryData.length)
        }
      }
    } catch (err: any) {
      console.error('Error fetching ride:', err)
      alert('Gagal memuat data ride: ' + err.message)
      router.push('/admin/rides')
    } finally {
      setLoadingData(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handlePrimaryPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPrimaryPicture(file)
      setPrimaryPictureFile(file) // Store original file for later upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setPrimaryPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSecondaryPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSecondaryPicture(file)
      setSecondaryPictureFile(file) // Store original file for later upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setSecondaryPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Format number dengan separator (1000 -> 1.000)
  const formatNumber = (value: string): string => {
    // Hapus semua karakter selain angka
    const numericValue = value.replace(/\D/g, '')
    // Format dengan separator titik
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse formatted number kembali ke angka (1.000 -> 1000)
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/\./g, '')
  }

  // Icon options untuk dropdown
  const iconOptions: { name: string; component: LucideIcon }[] = [
    { name: 'Clock', component: Clock },
    { name: 'MapPin', component: MapPin },
    { name: 'Users', component: Users },
    { name: 'Calendar', component: Calendar },
    { name: 'DollarSign', component: DollarSign },
    { name: 'Shield', component: Shield },
    { name: 'Zap', component: Zap },
    { name: 'Mountain', component: Mountain },
    { name: 'Route', component: Route },
    { name: 'Navigation', component: Navigation },
    { name: 'Activity', component: Activity },
    { name: 'Target', component: Target },
    { name: 'Award', component: Award },
    { name: 'AlertCircle', component: AlertCircle },
    { name: 'CheckCircle', component: CheckCircle },
    { name: 'Info', component: Info },
    { name: 'Star', component: Star },
    { name: 'Heart', component: Heart },
    { name: 'Camera', component: Camera },
    { name: 'Video', component: Video },
    { name: 'Phone', component: Phone },
    { name: 'Mail', component: Mail },
    { name: 'MessageSquare', component: MessageSquare },
    { name: 'Bell', component: Bell },
    { name: 'Settings', component: Settings },
    { name: 'BarChart', component: BarChart },
    { name: 'TrendingUp', component: TrendingUp },
    { name: 'Flame', component: Flame },
    { name: 'Droplet', component: Droplet },
    { name: 'Sun', component: Sun },
    { name: 'Moon', component: Moon },
    { name: 'Wind', component: Wind },
    { name: 'Cloud', component: Cloud },
    { name: 'Umbrella', component: Umbrella },
    { name: 'Eye', component: Eye },
    { name: 'EyeOff', component: EyeOff },
    { name: 'Lock', component: Lock },
    { name: 'Unlock', component: Unlock },
    { name: 'Gift', component: Gift },
    { name: 'ShoppingBag', component: ShoppingBag },
    { name: 'Package', component: Package },
    { name: 'Truck', component: Truck },
    { name: 'Car', component: Car },
    { name: 'Bike', component: Bike },
    { name: 'Train', component: Train },
    { name: 'Plane', component: Plane },
    { name: 'Ship', component: Ship },
    { name: 'Home', component: Home },
    { name: 'Building', component: Building },
    { name: 'Map', component: Map },
    { name: 'Compass', component: Compass },
    { name: 'Flag', component: Flag },
    { name: 'Sparkles', component: Sparkles },
    { name: 'HelpCircle', component: HelpCircle },
    { name: 'ChevronDown', component: ChevronDown },
    { name: 'ChevronUp', component: ChevronUp },
    { name: 'ChevronLeft', component: ChevronLeft },
    { name: 'ChevronRight', component: ChevronRight },
    { name: 'ArrowRight', component: ArrowRight },
    { name: 'ArrowLeft', component: ArrowLeft },
    { name: 'ArrowUp', component: ArrowUp },
    { name: 'ArrowDown', component: ArrowDown },
    { name: 'Download', component: Download },
    { name: 'Upload', component: UploadIcon },
    { name: 'FileText', component: FileText },
    { name: 'File', component: File },
    { name: 'Folder', component: Folder },
    { name: 'FolderOpen', component: FolderOpen },
    { name: 'Image', component: Image },
    { name: 'Music', component: Music },
    { name: 'Film', component: Film },
    { name: 'Book', component: Book },
    { name: 'BookOpen', component: BookOpen },
    { name: 'GraduationCap', component: GraduationCap },
    { name: 'Briefcase', component: Briefcase },
    { name: 'Coffee', component: Coffee },
    { name: 'Utensils', component: Utensils },
    { name: 'ShoppingCart', component: ShoppingCart },
    { name: 'CreditCard', component: CreditCard },
    { name: 'Banknote', component: Banknote },
    { name: 'Wallet', component: Wallet },
    { name: 'PiggyBank', component: PiggyBank },
    { name: 'Coins', component: Coins },
    { name: 'TrendingDown', component: TrendingDown },
    { name: 'Minus', component: Minus },
    { name: 'Plus', component: PlusIcon },
    { name: 'Check', component: Check },
    { name: 'XCircle', component: XCircle },
    { name: 'AlertTriangle', component: AlertTriangle },
    { name: 'Wifi', component: Wifi },
    { name: 'Bluetooth', component: Bluetooth },
    { name: 'Radio', component: Radio },
    { name: 'Tv', component: Tv },
    { name: 'Monitor', component: Monitor },
    { name: 'Smartphone', component: Smartphone },
    { name: 'Laptop', component: Laptop },
    { name: 'Tablet', component: Tablet },
    { name: 'Headphones', component: Headphones },
    { name: 'Speaker', component: Speaker },
    { name: 'Mic', component: Mic },
    { name: 'MicOff', component: MicOff },
    { name: 'Volume2', component: Volume2 },
    { name: 'VolumeX', component: VolumeX },
    { name: 'Volume1', component: Volume1 },
    { name: 'Play', component: Play },
    { name: 'Pause', component: Pause },
    { name: 'SkipForward', component: SkipForward },
    { name: 'SkipBack', component: SkipBack },
    { name: 'Shuffle', component: Shuffle },
    { name: 'Repeat', component: Repeat },
  ]

  const handleAddRideInfo = () => {
    setRideInfos([
      ...rideInfos,
      {
        id: Date.now().toString(),
        icon: "",
        question: "",
        answer: ""
      }
    ])
  }

  const handleRemoveRideInfo = (id: string) => {
    setRideInfos(rideInfos.filter(info => info.id !== id))
  }

  const handleRideInfoChange = (id: string, field: keyof RideInfo, value: string) => {
    setRideInfos(rideInfos.map(info => 
      info.id === id ? { ...info, [field]: value } : info
    ))
  }


  const handleRemoveGalleryPhoto = (id: string) => {
    setGalleryPhotos(galleryPhotos.filter(photo => photo.id !== id))
    // Remove file from stored files
    const newFiles = { ...galleryPhotoFiles }
    delete newFiles[id]
    setGalleryPhotoFiles(newFiles)
  }

  const handleGalleryPhotoChange = (id: string, field: keyof GalleryPhoto, value: string) => {
    setGalleryPhotos(galleryPhotos.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ))
  }

  const handleGalleryPhotoFileChange = async (id: string, file: File) => {
    // Store original file for later upload with rename
    setGalleryPhotoFiles(prev => ({ ...prev, [id]: file }))
    
    // Show base64 preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      handleGalleryPhotoChange(id, 'photo_url', reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const handleGalleryPhotoCountChange = (count: number) => {
    setGalleryPhotoCount(count)
    
    const currentCount = galleryPhotos.length
    
    if (count > currentCount) {
      // Adding more photos - keep existing ones and add new empty slots
      const newPhotos = [...galleryPhotos]
      const newFiles = { ...galleryPhotoFiles }
      
      for (let i = currentCount; i < count; i++) {
        const newId = `new-${Date.now()}-${i}`
        newPhotos.push({
          id: newId,
          photo_url: ""
        })
      }
      
      setGalleryPhotos(newPhotos)
      setGalleryPhotoFiles(newFiles)
    } else if (count < currentCount) {
      // Removing photos - keep only the first 'count' photos
      const updatedPhotos = galleryPhotos.slice(0, count)
      const updatedFiles: Record<string, File> = {}
      
      // Keep only files for the remaining photos
      updatedPhotos.forEach(photo => {
        if (galleryPhotoFiles[photo.id]) {
          updatedFiles[photo.id] = galleryPhotoFiles[photo.id]
        }
      })
      
      setGalleryPhotos(updatedPhotos)
      setGalleryPhotoFiles(updatedFiles)
    }
    // If count === currentCount, do nothing
  }

  const uploadImageToLocal = async (
    file: File, 
    folder: 'rides' | 'stories', 
    subfolder: string, 
    customFileName?: string
  ): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('subfolder', subfolder)
      if (customFileName) {
        formData.append('customFileName', customFileName)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Upload error:', error)
        return null
      }

      const data = await response.json()
      return data.url
    } catch (err) {
      console.error('Error uploading image:', err)
      return null
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      const parsedOriginalPrice = parseFormattedNumber(originalPrice)
      const parsedFinalPrice = parseFormattedNumber(finalPrice)
      
      if (!title || !parsedFinalPrice || !parsedOriginalPrice) {
        setError("Title, Original Price, dan Final Price wajib diisi")
        setLoading(false)
        return
      }

      // Upload images with rename format: id_primary, id_secondary, id_gallery_0
      let primaryPictureUrl = primaryPicturePreview || null
      let secondaryPictureUrl = secondaryPicturePreview || null

      if (primaryPictureFile) {
        const uploadedUrl = await uploadImageToLocal(
          primaryPictureFile, 
          'rides', 
          'primary', 
          `${rideId}_primary`
        )
        if (uploadedUrl) {
          primaryPictureUrl = uploadedUrl
        } else if (primaryPicturePreview) {
          // Use base64 preview if upload fails (fallback)
          primaryPictureUrl = primaryPicturePreview
          console.warn('Using base64 preview for primary picture (upload failed)')
        }
      }

      if (secondaryPictureFile) {
        const uploadedUrl = await uploadImageToLocal(
          secondaryPictureFile, 
          'rides', 
          'secondary', 
          `${rideId}_secondary`
        )
        if (uploadedUrl) {
          secondaryPictureUrl = uploadedUrl
        } else if (secondaryPicturePreview) {
          // Use base64 preview if upload fails (fallback)
          secondaryPictureUrl = secondaryPicturePreview
          console.warn('Using base64 preview for secondary picture (upload failed)')
        }
      }

      // Update ride
      const { error: updateError } = await supabase
        .from('rides')
        .update({
          title,
          tags: tags.length > 0 ? tags : null,
          short_description: shortDescription || null,
          description: description || null,
          primary_picture: primaryPictureUrl,
          secondary_picture: secondaryPictureUrl,
          original_price: parseFloat(parseFormattedNumber(originalPrice)),
          final_price: parseFloat(parseFormattedNumber(finalPrice)),
          type,
          duration: duration || null,
          location: location || null,
          meeting_point: meetingPoint || null,
          difficulty_level: difficultyLevel || null,
          whatsapp_message: whatsappMessage || null
        })
        .eq('id', rideId)

      if (updateError) {
        throw updateError
      }

      // Delete existing ride_infos and insert new ones
      const { error: deleteInfosError } = await supabase
        .from('ride_infos')
        .delete()
        .eq('ride_id', rideId)

      if (deleteInfosError) {
        throw deleteInfosError
      }

      if (rideInfos.length > 0) {
        const infosToInsert = rideInfos
          .filter(info => info.question && info.answer)
          .map((info, index) => ({
            ride_id: rideId,
            icon: info.icon || null,
            question: info.question,
            answer: info.answer,
            display_order: index
          }))

        if (infosToInsert.length > 0) {
          const { error: infosError } = await supabase
            .from('ride_infos')
            .insert(infosToInsert)

          if (infosError) {
            throw infosError
          }
        }
      }

      // Delete existing gallery photos and insert new ones
      const { error: deleteGalleryError } = await supabase
        .from('ride_gallery_photos')
        .delete()
        .eq('ride_id', rideId)

      if (deleteGalleryError) {
        throw deleteGalleryError
      }

      // Upload gallery photos with rename format: id_gallery_0, id_gallery_1, etc.
      const uploadedGalleryPhotos: { ride_id: string; photo_url: string; alt_text: null; display_order: number }[] = []
      
      if (galleryPhotos.length > 0) {
        for (let index = 0; index < galleryPhotos.length; index++) {
          const photo = galleryPhotos[index]
          const file = galleryPhotoFiles[photo.id]
          
          if (file) {
            const uploadedUrl = await uploadImageToLocal(
              file,
              'rides',
              'gallery',
              `${rideId}_gallery_${index}`
            )
            
            if (uploadedUrl) {
              uploadedGalleryPhotos.push({
                ride_id: rideId,
                photo_url: uploadedUrl,
                alt_text: null,
                display_order: index
              })
            }
          } else if (photo.photo_url) {
            // Use existing URL if no new file uploaded
            uploadedGalleryPhotos.push({
              ride_id: rideId,
              photo_url: photo.photo_url,
              alt_text: null,
              display_order: index
            })
          }
        }

        // Insert gallery_photos
        if (uploadedGalleryPhotos.length > 0) {
          const { error: photosError } = await supabase
            .from('ride_gallery_photos')
            .insert(uploadedGalleryPhotos)

          if (photosError) {
            throw photosError
          }
        }
      }

      // Redirect to rides list
      router.push('/admin/rides')
    } catch (err: any) {
      console.error('Error updating ride:', err)
      const errorMessage = err.message || err.error?.message || 'Gagal mengupdate ride. Silakan coba lagi.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loadingData) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <AdminSidebar />
        <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
          <AdminNavbar />
          <main className="p-6 lg:p-8 px-[30px] pt-24 lg:pt-8">
              <div className="bg-slate-900 rounded-lg p-6 text-center">
                <p className="text-gray-400">Memuat data...</p>
              </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-6 lg:p-8 px-[30px]" style={{ paddingTop: '100px' }}>
            <div className="mb-6">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-4">Edit Rides</h1>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1 min-w-0">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors flex-shrink-0 text-sm sm:text-base ${
                      step <= currentStep
                        ? 'bg-[#EE6A28] border-[#EE6A28] text-white'
                        : 'bg-transparent border-gray-600 text-gray-400'
                    }`}>
                      {step < currentStep ? '✓' : step}
                    </div>
                    {step < totalSteps && (
                      <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors ${
                        step < currentStep ? 'bg-[#EE6A28]' : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded mb-6">
                {error}
              </div>
            )}

            <div className="bg-slate-900 rounded-lg p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-white text-xl font-semibold mb-4">Informasi Dasar</h2>
                  
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      placeholder="Masukkan judul ride"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                        placeholder="Masukkan tag (contoh: Easy, Family, Nature)"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#EE6A28]/20 text-[#EE6A28] rounded text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-400"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Short Description</label>
                    <textarea
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      rows={2}
                      placeholder="Masukkan deskripsi singkat"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      rows={4}
                      placeholder="Masukkan deskripsi lengkap"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Type *</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as "group" | "personal")}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      >
                        <option value="group">Group</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Difficulty Level</label>
                      <input
                        type="text"
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                        placeholder="Masukkan tingkat kesulitan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Original Price *</label>
                      <input
                        type="text"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(formatNumber(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                        placeholder="Masukkan harga asli (contoh: 1.200.000)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Final Price *</label>
                      <input
                        type="text"
                        value={finalPrice}
                        onChange={(e) => setFinalPrice(formatNumber(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                        placeholder="Masukkan harga final (contoh: 1.000.000)"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Images & Location */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-white text-xl font-semibold mb-4">Gambar & Lokasi</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Primary Picture</label>
                      <div className="mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePrimaryPictureChange}
                          className="hidden"
                          id="primary-picture"
                        />
                        <label
                          htmlFor="primary-picture"
                          className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                        >
                          <Upload size={18} />
                          Upload Primary Picture
                        </label>
                      </div>
                      {primaryPicturePreview && (
                        <div className="relative mt-2">
                          <img
                            src={primaryPicturePreview}
                            alt="Primary preview"
                            className="w-full h-48 object-cover rounded border border-slate-700"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Secondary Picture</label>
                      <div className="mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSecondaryPictureChange}
                          className="hidden"
                          id="secondary-picture"
                        />
                        <label
                          htmlFor="secondary-picture"
                          className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                        >
                          <Upload size={18} />
                          Upload Secondary Picture
                        </label>
                      </div>
                      {secondaryPicturePreview && (
                        <div className="relative mt-2">
                          <img
                            src={secondaryPicturePreview}
                            alt="Secondary preview"
                            className="w-full h-48 object-cover rounded border border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      placeholder="Masukkan durasi (contoh: 7 Hours)"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      placeholder="Masukkan lokasi"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Meeting Point</label>
                    <input
                      type="text"
                      value={meetingPoint}
                      onChange={(e) => setMeetingPoint(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      placeholder="Masukkan titik pertemuan"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">WhatsApp Message</label>
                    <textarea
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      rows={3}
                      placeholder="Masukkan pesan WhatsApp default"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Ride Infos */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-semibold">Ride Infos / FAQ</h2>
                    <button
                      type="button"
                      onClick={handleAddRideInfo}
                      className="flex items-center gap-2 px-4 py-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white rounded transition-colors"
                    >
                      <Plus size={18} />
                      Add Info
                    </button>
                  </div>

                  {rideInfos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>Belum ada info. Klik "Add Info" untuk menambahkan.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rideInfos.map((info, index) => (
                        <div key={info.id} className="p-4 bg-slate-800 rounded border border-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-semibold">Info #{index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => handleRemoveRideInfo(info.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm mb-1">Icon</label>
                            <div 
                              className="relative"
                              ref={(el) => {
                                dropdownRefs.current[info.id] = el
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenIconDropdowns(prev => ({ ...prev, [info.id]: !prev[info.id] }))}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-[#EE6A28] flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {info.icon ? (
                                    <>
                                      {(() => {
                                        const IconComponent = iconOptions.find(opt => opt.name === info.icon)?.component
                                        return IconComponent ? (
                                          <IconComponent size={18} className="text-[#EE6A28]" />
                                        ) : (
                                          <span className="text-gray-400">Pilih icon</span>
                                        )
                                      })()}
                                    </>
                                  ) : (
                                    <span className="text-gray-400">Pilih icon</span>
                                  )}
                                </div>
                                <ChevronRight 
                                  size={16} 
                                  className={`transition-transform ${openIconDropdowns[info.id] ? 'rotate-90' : ''}`}
                                />
                              </button>
                              {openIconDropdowns[info.id] && (
                                <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded shadow-lg max-h-80 overflow-hidden flex flex-col">
                                  <div className="p-2 border-b border-slate-600">
                                    <div className="relative">
                                      <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                      <input
                                        type="text"
                                        value={iconSearchQueries[info.id] || ''}
                                        onChange={(e) => setIconSearchQueries(prev => ({ ...prev, [info.id]: e.target.value }))}
                                        placeholder="Cari icon..."
                                        className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-[#EE6A28]"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </div>
                                  <div className="overflow-y-auto max-h-60 p-2">
                                    <div className="grid grid-cols-4 gap-2">
                                      {iconOptions
                                        .filter(iconOption => 
                                          iconSearchQueries[info.id] 
                                            ? iconOption.name.toLowerCase().includes(iconSearchQueries[info.id].toLowerCase())
                                            : true
                                        )
                                        .map((iconOption) => {
                                          const IconComponent = iconOption.component
                                          const isSelected = info.icon === iconOption.name
                                          return (
                                            <button
                                              key={iconOption.name}
                                              type="button"
                                              onClick={() => {
                                                handleRideInfoChange(info.id, 'icon', iconOption.name)
                                                setOpenIconDropdowns(prev => ({ ...prev, [info.id]: false }))
                                                setIconSearchQueries(prev => ({ ...prev, [info.id]: '' }))
                                              }}
                                              className={`p-2 rounded border transition-colors ${
                                                isSelected
                                                  ? 'bg-[#EE6A28]/20 border-[#EE6A28]'
                                                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                                              }`}
                                              title={iconOption.name}
                                            >
                                              <IconComponent 
                                                size={24} 
                                                className={`mx-auto ${isSelected ? 'text-[#EE6A28]' : 'text-white'}`}
                                              />
                                            </button>
                                          )
                                        })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm mb-1">Question</label>
                            <input
                              type="text"
                              value={info.question}
                              onChange={(e) => handleRideInfoChange(info.id, 'question', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-[#EE6A28]"
                              placeholder="Masukkan pertanyaan"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">Answer</label>
                            <RichTextEditor
                              content={info.answer}
                              onChange={(content) => handleRideInfoChange(info.id, 'answer', content)}
                              placeholder="Masukkan jawaban"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Gallery Photos */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-semibold">Gallery Photos</h2>
                    <div className="flex items-center gap-3">
                      <label className="text-white text-sm font-semibold">Jumlah Foto:</label>
                      <select
                        value={galleryPhotoCount}
                        onChange={(e) => handleGalleryPhotoCountChange(parseInt(e.target.value))}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                      >
                        <option value={1}>1 Foto</option>
                        <option value={4}>4 Foto</option>
                        <option value={6}>6 Foto</option>
                      </select>
                    </div>
                  </div>

                  {galleryPhotos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>Pilih jumlah foto dari dropdown di atas, kemudian upload foto untuk setiap slot.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryPhotos.map((photo, index) => (
                        <div key={photo.id} className="p-4 bg-slate-800 rounded border border-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-white font-semibold text-sm">Photo #{index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(photo.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <div className="mb-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleGalleryPhotoFileChange(photo.id, file)
                                }
                              }}
                              className="hidden"
                              id={`gallery-photo-${photo.id}`}
                            />
                            <label
                              htmlFor={`gallery-photo-${photo.id}`}
                              className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm hover:bg-slate-600 transition-colors"
                            >
                              <ImageIcon size={16} />
                              {photo.photo_url ? 'Change Photo' : 'Upload Photo'}
                            </label>
                          </div>
                          {photo.photo_url && (
                            <div>
                              <img
                                src={photo.photo_url}
                                alt="Gallery preview"
                                className="w-full h-32 object-cover rounded border border-slate-700"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700 gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>
                  {currentStep < totalSteps && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                    >
                      <span className="text-xs sm:text-sm">Next</span>
                      <ChevronRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/rides')}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? <span className="text-xs sm:text-sm">Menyimpan...</span> : <span className="text-xs sm:text-sm">Submit</span>}
                  </button>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
  )
}

export default function EditRidesPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <EditRidesContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}
