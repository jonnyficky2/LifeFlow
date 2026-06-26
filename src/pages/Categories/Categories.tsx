import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTasks } from '../../hooks/useTasks';

export const Categories: React.FC = () => {
  const { appData, setAppData } = useAppContext();
  const { addCategory, deleteCategory } = useTasks();
  const { saveHistorySnapshot } = useAppContext();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
    setNewCategory('');
  };

  const handleEditCategory = (index: number) => {
    const newName = window.prompt("Enter new category name:", appData[index].name);
    if (newName) {
      saveHistorySnapshot();
      setAppData(prev => {
        const newData = [...prev];
        newData[index].name = newName;
        return newData;
      });
    }
  };



  return (
    <div id="categoriesSection" className="categories-wrapper section-page" style={{ display: 'block' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {appData.map((cat, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--dash-bg)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 500 }}>{cat.name} <span style={{ color: 'var(--dash-text-muted)', fontSize: '0.85em' }}>({cat.tasks?.length || 0} tasks)</span></span>
                <div>
                  <button onClick={() => handleEditCategory(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>✏️</button>
                  <button onClick={() => deleteCategory(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="add-box" style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            id="categoryInput"
            placeholder="Add category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            style={{ flex: 1 }}
          />
          <button id="categoryPanelAddBtn" onClick={handleAddCategory}>Add</button>
        </div>
      </section>
    </div>
  );
};
