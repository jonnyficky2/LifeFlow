import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTasks } from '../../hooks/useTasks';

export const Categories: React.FC = () => {
  const { appData, setAppData } = useAppContext();
  const { addCategory, deleteCategory } = useTasks();
  const { saveHistorySnapshot } = useAppContext();
  const [newCategory, setNewCategory] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  
  // Custom Deletion Confirmation State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDeleteIndex, setTargetDeleteIndex] = useState<number | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
    setNewCategory('');
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditingName(appData[index].name);
  };

  const handleSaveCategory = (index: number) => {
    if (editingName.trim()) {
      saveHistorySnapshot();
      setAppData(prev => {
        const newData = [...prev];
        newData[index].name = editingName.trim();
        return newData;
      });
    }
    setEditingIndex(null);
  };

  const triggerDeleteCategory = (index: number) => {
    setTargetDeleteIndex(index);
    setConfirmOpen(true);
  };

  return (
    <div id="categoriesSection" className="categories-wrapper section-page">
      <div className="dashboard-header categories-header-wrapper">
        <div>
          <h1>▣ Categories</h1>
          <p>Organize your tasks into custom categories</p>
        </div>
      </div>

      <section className="dashboard-panel categories-panel">
        <div className="panel-header">
          <h2>Categories List</h2>
        </div>
        
        {appData.length === 0 ? (
          <div className="empty-state category-empty-row">
            <div className="empty-state__icon">▱</div>
            <div className="empty-state__content">
              <h3 className="empty-state__title">No Categories Yet</h3>
              <p className="empty-state__description">Organize your life by grouping tasks into categories.</p>
            </div>
          </div>
        ) : (
          <div className="categories-list-container">
            {appData.map((cat, index) => (
              <div 
                key={index} 
                className="category-list-item"
              >
                {editingIndex === index ? (
                  <div style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={editingName} 
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveCategory(index);
                        else if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      autoFocus
                      style={{ flex: 1, height: '36px', padding: '0 8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                    />
                    <button className="btn-primary" onClick={() => handleSaveCategory(index)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Save</button>
                    <button className="btn-secondary" onClick={() => setEditingIndex(null)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="category-list-item-title">
                      {cat.name}{' '}
                      <span className="category-list-item-count">
                        ({cat.tasks?.length || 0} tasks)
                      </span>
                    </span>
                    <div>
                      <button onClick={() => handleEditCategory(index)} className="category-action-btn category-action-edit">✏️</button>
                      <button onClick={() => triggerDeleteCategory(index)} className="category-action-btn category-action-delete">🗑</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="add-box categories-add-form-flex">
          <input
            type="text"
            id="categoryInput"
            placeholder="Add category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="categories-add-input"
          />
          <button id="categoryPanelAddBtn" onClick={handleAddCategory}>Add</button>
        </div>
      </section>

      {confirmOpen && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
            <h3>Delete Category</h3>
            <p style={{ margin: '16px 0', color: 'var(--color-muted)' }}>
              Are you sure you want to delete the category "{targetDeleteIndex !== null ? appData[targetDeleteIndex].name : ''}" and all tasks inside?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => {
                if (targetDeleteIndex !== null) {
                  deleteCategory(targetDeleteIndex);
                }
                setConfirmOpen(false);
                setTargetDeleteIndex(null);
              }}>Delete</button>
              <button className="btn btn-secondary" onClick={() => {
                setConfirmOpen(false);
                setTargetDeleteIndex(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
