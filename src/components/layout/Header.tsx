import { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { CreateCaseModal } from '@/components/cases/CreateCaseModal';
import { casesService } from '@/services/cases.service';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateCase = async (data: any) => {
    try {
      // Данные уже в правильном формате из CreateCaseModal
      const newCase = await casesService.create(data);
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Case Created',
        message: `Case "${data.title}" has been successfully created`,
      });
      
      navigate(`/cases/${newCase.id}`);
    } catch (error: any) {
      console.error('Failed to create case:', error);
      
      // Более детальная информация об ошибке
      let errorMessage = 'Failed to create case';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((e: any) => e.message || e).join(', ');
        }
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      
      throw error;
    }
  };

  return (
    <>
      <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar placeholder="Search cases, evidence, events..." />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Case
          </Button>
        </div>
      </header>

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </>
  );
};  