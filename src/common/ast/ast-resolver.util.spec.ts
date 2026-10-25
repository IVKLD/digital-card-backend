import { extractRelationsFromInfo } from './ast-resolver.util';
import { GraphQLResolveInfo, Kind } from 'graphql';

describe('extractRelationsFromInfo', () => {
  it('should return all false when info is undefined or empty', () => {
    const result = extractRelationsFromInfo(undefined);
    expect(result).toEqual({
      skills: false,
      experience: false,
      projects: false,
    });
  });

  it('should detect requested top-level relations', () => {
    const fakeInfo = {
      fieldNodes: [
        {
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: 'profile' },
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'name' },
              },
              {
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'skills' },
              },
              {
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'projects' },
              },
            ],
          },
        },
      ],
      fragments: {},
    } as unknown as GraphQLResolveInfo;

    const result = extractRelationsFromInfo(fakeInfo);
    expect(result).toEqual({
      skills: true,
      experience: false,
      projects: true,
    });
  });

  it('should traverse inline fragments and fragment spreads', () => {
    const fakeInfo = {
      fieldNodes: [
        {
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: 'profile' },
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.INLINE_FRAGMENT,
                selectionSet: {
                  kind: Kind.SELECTION_SET,
                  selections: [
                    {
                      kind: Kind.FIELD,
                      name: { kind: Kind.NAME, value: 'experience' },
                    },
                  ],
                },
              },
              {
                kind: Kind.FRAGMENT_SPREAD,
                name: { kind: Kind.NAME, value: 'ProjectFrag' },
              },
            ],
          },
        },
      ],
      fragments: {
        ProjectFrag: {
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'projects' },
              },
            ],
          },
        },
      },
    } as unknown as GraphQLResolveInfo;

    const result = extractRelationsFromInfo(fakeInfo);
    expect(result).toEqual({
      skills: false,
      experience: true,
      projects: true,
    });
  });
});
