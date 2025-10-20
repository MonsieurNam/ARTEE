// components/size-chart-modal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Giả sử bạn có component Tabs từ shadcn/ui

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
}

// Dữ liệu bảng size mẫu
const sizeData = {
  tee: [
    { size: 'S', chest: '86-94 cm', length: '69 cm' },
    { size: 'M', chest: '94-102 cm', length: '72 cm' },
    { size: 'L', chest: '102-110 cm', length: '74 cm' },
    { size: 'XL', chest: '110-118 cm', length: '76 cm' },
    { size: 'XXL', chest: '118-126 cm', length: '78 cm' },
  ],
  hoodie: [
    { size: 'S', chest: '90-98 cm', length: '70 cm' },
    { size: 'M', chest: '98-106 cm', length: '73 cm' },
    { size: 'L', chest: '106-114 cm', length: '75 cm' },
    { size: 'XL', chest: '114-122 cm', length: '77 cm' },
    { size: 'XXL', chest: '122-130 cm', length: '79 cm' },
  ],
  polo: [
    { size: 'S', chest: '88-96 cm', length: '68 cm' },
    { size: 'M', chest: '96-104 cm', length: '71 cm' },
    { size: 'L', chest: '104-112 cm', length: '73 cm' },
    { size: 'XL', chest: '112-120 cm', length: '75 cm' },
    { size: 'XXL', chest: '120-128 cm', length: '77 cm' },
  ],
}

const SizeChartTable = ({ data }: { data: { size: string; chest: string; length: string; }[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-foreground">
      <thead className="text-xs text-muted-foreground uppercase bg-secondary">
        <tr>
          <th scope="col" className="px-6 py-3">Kích cỡ</th>
          <th scope="col" className="px-6 py-3">Vòng ngực</th>
          <th scope="col" className="px-6 py-3">Chiều dài áo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.size} className="bg-card border-b border-border">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{row.size}</th>
            <td className="px-6 py-4">{row.chest}</td>
            <td className="px-6 py-4">{row.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-bold text-foreground">Bảng Kích Cỡ</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          <Tabs defaultValue="tee" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tee">Áo Thun</TabsTrigger>
              <TabsTrigger value="hoodie">Hoodie</TabsTrigger>
              <TabsTrigger value="polo">Polo</TabsTrigger>
            </TabsList>
            <TabsContent value="tee"><SizeChartTable data={sizeData.tee} /></TabsContent>
            <TabsContent value="hoodie"><SizeChartTable data={sizeData.hoodie} /></TabsContent>
            <TabsContent value="polo"><SizeChartTable data={sizeData.polo} /></TabsContent>
          </Tabs>
           <p className="text-xs text-muted-foreground mt-4">*Các số đo có thể có chênh lệch nhỏ (1-2 cm).</p>
        </div>
      </Card>
    </div>
  )
}