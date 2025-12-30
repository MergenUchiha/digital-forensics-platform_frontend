import { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { CreateCaseModal, CaseFormData } from '@/components/cases/CreateCaseModal';
import { casesService } from '@/services/cases.service';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateCase = async (data: CaseFormData) => {
    try {
      const newCase = await casesService.create(data);
      (window as any).showNotification?.({
        type: 'success',
        title: 'Case Created',
        message: `Case "${data.title}" has been successfully created`,
      });
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Failed to create case:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to create case',
      });
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