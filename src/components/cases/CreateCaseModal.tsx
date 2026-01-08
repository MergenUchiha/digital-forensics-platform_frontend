import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export interface CaseFormData {
  title: string;
  description: string;
  severity: string;
  status?: string;
  tags?: string[];
  location?: {
    city: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  assignedToId?: string;
}

export const CreateCaseModal = ({ isOpen, onClose, onSubmit }: CreateCaseModalProps) => {
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    description: '',
    severity: 'MEDIUM',
    status: 'OPEN',
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      setFormData({
        title: '',
        description: '',
        severity: 'MEDIUM',
        status: 'OPEN',
        tags: [],
      });
      setTagInput('');
      onClose();
    } catch (error) {
      console.error('Failed to create case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Case" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Case Title *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter case title..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the incident..."
            rows={4}
            required
            className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Severity & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Severity *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all duration-200"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent transition-all duration-200"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              City
            </label>
            <Input
              type="text"
              value={formData.location?.city || ''}
              onChange={(e) => setFormData({
                ...formData,
                location: { 
                  ...formData.location, 
                  city: e.target.value, 
                  country: formData.location?.country || '' 
                }
              })}
              placeholder="e.g., San Francisco"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Country
            </label>
            <Input
              type="text"
              value={formData.location?.country || ''}
              onChange={(e) => setFormData({
                ...formData,
                location: { 
                  city: formData.location?.city || '', 
                  country: e.target.value 
                }
              })}
              placeholder="e.g., USA"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag and press Enter..."
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-bg-tertiary text-text-secondary text-sm rounded-full flex items-center gap-2 border border-border-primary"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-text-muted hover:text-text-primary"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border-primary">
          <Button 
            type="submit" 
            variant="primary" 
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};