'use client'
import { CheckCircle2, Construction, CalendarClock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageModels} from "@/lib/image-generator/models"
import { HY_MOTION_MODELS } from '@/lib/hy-motion/constants';
import { ModelType } from '@/lib/image-generator/type';
// 1. Define Types
type ModelStatus = 'available' | 'coming_soon' | 'planned';

interface CreditModel {
  id: string;
  modelName: string;
  status: ModelStatus;
  cost: string;
  description: string;
}

const creditsData:CreditModel[] = HY_MOTION_MODELS.flatMap(m=>(
[

        {
        id:m.id,
        modelName:m.name,
        status: m.isAvailable ? "available" : 'coming_soon',
        cost: `${m.credit} Credits / Image`,
        description: m.description
    }
]
))
const finalData = [...creditsData,  {
    id: 'more',
    modelName: 'More Models',
    status: 'planned',
    cost: 'TBD',
    description: 'Support for more models',
  },]

// 3. Helper Component for Status Icon/Text
const StatusBadge = ({ status }: { status: ModelStatus }) => {
  switch (status) {
    case 'available':
      return (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <CheckCircle2 className="w-5 h-5 bg-green-100 rounded-full p-0.5" />
          <span>Available</span>
        </div>
      );
    case 'coming_soon':
      return (
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <Construction className="w-5 h-5 text-amber-600" />
          <span>Coming Soon</span>
        </div>
      );
    case 'planned':
      return (
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <CalendarClock className="w-5 h-5 text-blue-500" />
          <span>Planned</span>
        </div>
      );
    default:
      return null;
  }
};

// 4. Main Table Component
export default function CreditUsageTable() {
    const t= useTranslations("creditsFaq")
  return (

           <div className="mt-12 mb-8">
          <h2 className="text-3xl font-semibold mb-4">
            {t("title")}
          </h2>



<div className="w-full py-10 px-4">
  {/* Header */}
  <h2 className="text-2xl font-bold text-gray-900 mb-6"> {t("table.title")}</h2>

  {/* Table Container */}
  {/* 移除 min-w-[800px]，改为 overflow-x-auto 以防前三列内容太长时仍需滚动 */}
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          {/* 1. Model: 防止换行，按需宽度 */}
          <th className="py-4 pr-8  font-semibold text-gray-900 whitespace-nowrap">
            {t("table.model")}
          </th>
          
          {/* 2. Status: 防止换行，按需宽度 */}
          <th className="py-4 px-4 lg:px-8 font-semibold text-gray-900 whitespace-nowrap">
            {t("table.status")}
          </th>
          
          {/* 3. Cost: 防止换行，按需宽度 */}
          <th className="py-4 px-4 lg:px-8 font-semibold text-gray-900 whitespace-nowrap">
            {t("table.cost")}
          </th>
          
          {/* 4. Description: 
              - hidden: 手机端隐藏
              - md:table-cell: 中屏以上显示
              - w-full: 强制占据剩余空间
          */}
          <th className="hidden md:table-cell py-4 pl-8 font-semibold text-gray-900 whitespace-nowrap">
            {t("table.description")}
          </th>
        </tr>
      </thead>
      <tbody className="text-sm md:text-base">
        {finalData.map((row,idx) => (
          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
            
            {/* Model Name */}
            <td className="py-5 pr-8 align-top font-semibold text-gray-900 whitespace-nowrap">
              {row.modelName}
            </td>

            {/* Status */}
            <td className="py-5 px-4 align-top whitespace-nowrap">
              <StatusBadge status={row.status as ModelStatus} />
            </td>

            {/* Cost */}
            <td className="py-5 px-4 align-top whitespace-nowrap">
              <span className={`font-semibold ${row.cost === 'TBD' ? 'text-gray-500 font-normal' : 'text-gray-900'}`}>
                {row.cost}
              </span>
            </td>

            {/* Description: 同样加上 hidden md:table-cell */}
            <td className="hidden md:table-cell py-5 pl-8 align-top text-gray-600 leading-relaxed">
              {row.description}
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


              <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{t("outOfCredits.title")}</h4>
            <p>
              {t("outOfCredits.text")}
            </p>
          </div>
        </div>
  );
}