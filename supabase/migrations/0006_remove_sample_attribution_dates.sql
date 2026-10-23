-- Remove placeholder interview attributions and dates from existing samples.
update public.entries
set contributor = null,
    entry_date = null
where is_sample = true;

update public.people
set attribution_label = null
where id = 'person-community-elder';
