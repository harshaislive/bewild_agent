PS E:\AI APPS\bewild_agent-main> npm run build

> mcp_agent@0.1.0 prebuild
> npm run lint && npm run typecheck


> mcp_agent@0.1.0 lint
> next lint

✔ No ESLint warnings or errors

> mcp_agent@0.1.0 typecheck
> tsc --noEmit

src/app/api/posts/route.ts:41:13 - error TS2339: Property 'data' does not exist on type 'unknown'.

41     const { data, error } = await withRetry(() =>
               ~~~~

src/app/api/posts/route.ts:41:19 - error TS2339: Property 'error' does not exist on type 'unknown'.

41     const { data, error } = await withRetry(() =>
                     ~~~~~

src/app/api/posts/route.ts:42:7 - error TS2739: Type 'PostgrestBuilder<any, false>' is missing the following properties from type 'Promise<unknown>': catch, finally, [Symbol.toStringTag]

 42       supabase
          ~~~~~~~~
 43         .from('approvedposts')
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
 56         .select()
    ~~~~~~~~~~~~~~~~~
 57         .single()
    ~~~~~~~~~~~~~~~~~

  src/lib/supabase.ts:53:14
    53   operation: () => Promise<T>,
                    ~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.

src/app/api/posts/route.ts:80:13 - error TS2339: Property 'data' does not exist on type 'unknown'.

80     const { data, error } = await withRetry(() =>
               ~~~~

src/app/api/posts/route.ts:80:19 - error TS2339: Property 'error' does not exist on type 'unknown'.

80     const { data, error } = await withRetry(() =>
                     ~~~~~

src/app/api/posts/route.ts:81:7 - error TS2739: Type 'PostgrestFilterBuilder<any, any, any[], "approvedposts", unknown>' is missing the following properties from type 'Promise<unknown>': catch, finally, [Symbol.toStringTag]

81       supabase
         ~~~~~~~~
82         .from('approvedposts')
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
83         .select('*')
   ~~~~~~~~~~~~~~~~~~~~
84         .order('due_date', { ascending: true })
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  src/lib/supabase.ts:53:14
    53   operation: () => Promise<T>,
                    ~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.

src/app/page.tsx:24:17 - error TS2339: Property 'data' does not exist on type 'unknown'.

24         const { data, error } = await withRetry(() =>
                   ~~~~

src/app/page.tsx:24:23 - error TS2339: Property 'error' does not exist on type 'unknown'.

24         const { data, error } = await withRetry(() =>
                         ~~~~~

src/app/page.tsx:25:11 - error TS2739: Type 'PostgrestFilterBuilder<any, any, any[], "approvedposts", unknown>' is missing the following properties from type 'Promise<unknown>': catch, finally, [Symbol.toStringTag]

25           supabase
             ~~~~~~~~
26             .from('approvedposts')
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
27             .select('*')
   ~~~~~~~~~~~~~~~~~~~~~~~~
28             .order('due_date', { ascending: true })
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  src/lib/supabase.ts:53:14
    53   operation: () => Promise<T>,
                    ~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.

src/app/page.tsx:76:30 - error TS2322: Type '{ showBackButton: boolean; }' is not assignable to type 'IntrinsicAttributes'.
  Property 'showBackButton' does not exist on type 'IntrinsicAttributes'.

76         <ContentCalendarView showBackButton={true} />
                                ~~~~~~~~~~~~~~

src/components/GeneratedPosts.tsx:87:24 - error TS7006: Parameter 'prev' implicitly has an 'any' type.

87       setApprovedPosts(prev => [...prev, formattedPost]);
                          ~~~~

src/components/GeneratedPosts.tsx:87:24 - error TS2345: Argument of type '(prev: any) => any[]' is not assignable to parameter of type 'ApprovedPost[]'.

87       setApprovedPosts(prev => [...prev, formattedPost]);
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  src/components/GeneratedPosts.tsx:87:24
    87       setApprovedPosts(prev => [...prev, formattedPost]);
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Did you mean to call this expression?

src/components/GeneratedPosts.tsx:90:25 - error TS7006: Parameter 'prev' implicitly has an 'any' type.

90       setGeneratedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                           ~~~~

src/components/GeneratedPosts.tsx:90:25 - error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type 'PostIdea[]'.

90       setGeneratedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/components/GeneratedPosts.tsx:90:45 - error TS7006: Parameter 'p' implicitly has an 'any' type.

90       setGeneratedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                                               ~

src/components/GeneratedPosts.tsx:93:24 - error TS7006: Parameter 'prev' implicitly has an 'any' type.

93       setSelectedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                          ~~~~

src/components/GeneratedPosts.tsx:93:24 - error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type 'PostIdea[]'.

93       setSelectedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/components/GeneratedPosts.tsx:93:44 - error TS7006: Parameter 'p' implicitly has an 'any' type.

93       setSelectedPosts(prev => prev.filter(p => p.id !== configuredPost.id));
                                              ~

src/components/PostCard.tsx:47:56 - error TS2769: No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'unknown' is not assignable to parameter of type 'string | number'.

47   const dueDate = 'due_date' in post ? format(new Date(post.due_date), 'MMM dd, yyyy') : null;
                                                          ~~~~~~~~~~~~~


src/components/PostCard.tsx:85:24 - error TS2345: Argument of type 'unknown' is not assignable to parameter of type 'string'.

85           {getTypeIcon(postType)}
                          ~~~~~~~~

src/components/PostCard.tsx:86:40 - error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.

86           <span className="capitalize">{postType}</span>
                                          ~~~~~~~~~~

  node_modules/@types/react/index.d.ts:2155:9
    2155         children?: ReactNode | undefined;
                 ~~~~~~~~
    The expected type comes from property 'children' which is declared here on type 'DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>'

src/components/PostConfigurationModal.tsx:2:30 - error TS2459: Module '"../types/posts"' declares 'VoiceOverType' locally, but it is not exported.

2 import { PostIdea, PostType, VoiceOverType, ApprovedPost } from '../types/posts';
                               ~~~~~~~~~~~~~

  src/types/posts.ts:2:6
    2 enum VoiceOverType {
           ~~~~~~~~~~~~~
    'VoiceOverType' is declared here.

src/lib/supabase.ts:27:11 - error TS2430: Interface 'SupabaseError' incorrectly extends interface 'Error'.
  Types of property 'message' are incompatible.
    Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.

27 interface SupabaseError extends Error {
             ~~~~~~~~~~~~~


Found 23 errors in 6 files.

Errors  Files
     6  src/app/api/posts/route.ts:41
     4  src/app/page.tsx:24
     8  src/components/GeneratedPosts.tsx:87
     3  src/components/PostCard.tsx:47
     1  src/components/PostConfigurationModal.tsx:2
     1  src/lib/supabase.ts:27