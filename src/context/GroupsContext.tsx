import React, { createContext, ReactNode, useContext, useState } from 'react';
import { colors } from '../theme/tokens';

export interface Group {
  id: string;
  label: string;
  accentColor: string;
}

interface GroupsContextValue {
  groups: Group[];
  addGroup: (group: Group) => void;
}

const GroupsContext = createContext<GroupsContextValue | undefined>(undefined);

const INITIAL_GROUPS: Group[] = [{ id: 'me', label: '눈눈', accentColor: colors.mint }];

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  const addGroup = (group: Group) => {
    setGroups((prev) => (prev.some((g) => g.id === group.id) ? prev : [...prev, group]));
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup }}>{children}</GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
