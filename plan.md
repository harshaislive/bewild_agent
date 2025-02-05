I wanna do a simple front end app like below. (Should only do what I ask)

1. A simple front end like Typeform. Which gathers all details about current month's social media plan, context, product launches, we can input brand guidelines etc, target audience and everything. Outputs 20 ideas for posts. Has re-generate(regenerates new ideas using omit already created ideas) and select option, delete option. Gives us option to select type of it(reel carousel static post etc). Each post has a publish date(which we shall feed) and due date is auto calculated to be 3 days prior. LLM to be used is mistral. Should have solid system prompt (Multiple if needed).


2. All approved posts are added to Supabase tables. (Approved posts)


3. We should build this like a typeform modal in apple standards, very high quality design with animations but light weight.


Supabase tables:

CREATE TABLE ApprovedPosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_idea TEXT NOT NULL,
  aims TEXT[],
  context TEXT,
  reference_materials TEXT[],
  confidence_level INT CHECK (confidence_level BETWEEN 1 AND 10),
  post_type VARCHAR(50) NOT NULL,
  voice_over_required BOOLEAN,
  voice_over_type VARCHAR(50),
  publish_date DATE NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);