import { FieldNode, GraphQLResolveInfo, Kind, SelectionSetNode } from 'graphql';

export interface ProfileRelationsSelection {
  skills: boolean;
  experience: boolean;
  projects: boolean;
}

/**
 * Traverses GraphQLResolveInfo AST to detect whether relational fields
 * (skills, experience, projects) are requested in the current query.
 *
 * This allows the root resolver to optimize SQL execution with Prisma include/select,
 * completely avoiding N+1 roundtrips.
 */
export function extractRelationsFromInfo(
  info?: GraphQLResolveInfo,
): ProfileRelationsSelection {
  const relations: ProfileRelationsSelection = {
    skills: false,
    experience: false,
    projects: false,
  };

  if (!info || !info.fieldNodes || info.fieldNodes.length === 0) {
    return relations;
  }

  function traverseSelectionSet(selectionSet?: SelectionSetNode): void {
    if (!selectionSet || !selectionSet.selections) {
      return;
    }

    for (const selection of selectionSet.selections) {
      if (selection.kind === Kind.FIELD) {
        const name = selection.name.value;
        if (name === 'skills') {
          relations.skills = true;
        } else if (name === 'experience') {
          relations.experience = true;
        } else if (name === 'projects') {
          relations.projects = true;
        }
      } else if (selection.kind === Kind.INLINE_FRAGMENT) {
        traverseSelectionSet(selection.selectionSet);
      } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
        const fragment = info?.fragments?.[selection.name.value];
        if (fragment) {
          traverseSelectionSet(fragment.selectionSet);
        }
      }
    }
  }

  for (const fieldNode of info.fieldNodes) {
    traverseSelectionSet(fieldNode.selectionSet);
  }

  return relations;
}
