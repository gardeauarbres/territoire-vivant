-- Enable deletion for users (so they can remove their own rejected photos)
create policy "Users can delete their own discoveries" 
on discoveries 
for delete 
using (auth.uid() = user_id);

-- Enable updates for users (if needed, though mainly handled by server action which might use service role if configured, but here we use user auth)
-- Note: 'updateDiscoveryStatus' seems to rely on user auth context.
create policy "Users can update their own discoveries" 
on discoveries 
for update 
using (auth.uid() = user_id);

-- Ensure Insert is also covered if not already
-- create policy "Users can insert their own discoveries" on discoveries for insert with check (auth.uid() = user_id);
