import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
  variant = 'danger',
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t('apiKeys.confirmTitle')}
      maxWidth="max-w-md"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {message || t('apiKeys.confirmMsg')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText || t('apiKeys.btnCancel')}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText || t('apiKeys.confirmBtn')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
