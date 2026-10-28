// =========================================
// EDIT PROFILE PAGE (with Profile Picture Upload)
// =========================================

async function initEditProfilePage() {
    const editProfilePage = document.getElementById("edit-profile-page-component");
    if (!editProfilePage) return;

    // Check if user is logged in
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    // Load current profile data
    await loadProfileData(user.id);

    // Handle profile picture change
    const avatarInput = document.getElementById("avatarInput");
    const avatarPreview = document.getElementById("avatarPreview");
    const changeAvatarBtn = document.getElementById("changeAvatarBtn");

    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener("click", () => {
            avatarInput.click();
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Only allow images
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file (jpg, png, etc.)");
                return;
            }

            // Max 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert("Image must be less than 2MB");
                return;
            }

            // Show preview immediately
            const reader = new FileReader();
            reader.onload = (event) => {
                if (avatarPreview) {
                    avatarPreview.src = event.target.result;
                }
            };
            reader.readAsDataURL(file);

            // Upload to Supabase Storage
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/avatar.${fileExt}`;

                // Upload the file
                const { error: uploadError } = await supabaseClient
                    .storage
                    .from('avatars')
                    .upload(fileName, file, {
                        upsert: true, // overwrite if already exists
                        contentType: file.type
                    });

                if (uploadError) {
                    console.error(uploadError);
                    alert("Failed to upload image: " + uploadError.message);
                    return;
                }

                // Get the public URL
                const { data: { publicUrl } } = supabaseClient
                    .storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                // Save the URL to the profiles table
                const { error: updateError } = await supabaseClient
                    .from('profiles')
                    .update({ 
                        avatar_url: publicUrl,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (updateError) {
                    console.error(updateError);
                    alert("Image uploaded but failed to save profile. Please try again.");
                    return;
                }

                alert("Profile picture updated successfully!");

            } catch (err) {
                console.error(err);
                alert("Something went wrong while uploading the picture.");
            }
        });
    }

    // Handle form submission (name, phone, etc.)
    const editForm = document.getElementById("editProfileForm");
    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fullName = document.getElementById("editFullName")?.value.trim();
            const username = document.getElementById("editUsername")?.value.trim();
            const phone = document.getElementById("editPhone")?.value.trim();

            try {
                const { error } = await supabaseClient
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        username: username,
                        phone: phone || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (error) {
                    alert("Failed to update profile: " + error.message);
                    return;
                }

                alert("Profile updated successfully!");
                
            } catch (err) {
                console.error(err);
                alert("Something went wrong. Please try again.");
            }
        });
    }
}

// Load profile data from database
async function loadProfileData(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error loading profile:", error);
            return;
        }

        if (data) {
            // Fill the form fields
            const fullNameInput = document.getElementById("editFullName");
            const usernameInput = document.getElementById("editUsername");
            const phoneInput = document.getElementById("editPhone");
            const emailInput = document.getElementById("editEmail");
            const avatarPreview = document.getElementById("avatarPreview");

            if (fullNameInput) fullNameInput.value = data.full_name || "";
            if (usernameInput) usernameInput.value = data.username || "";
            if (phoneInput) phoneInput.value = data.phone || "";
            if (emailInput) emailInput.value = data.email || "";

            // Show avatar or blank image
            if (avatarPreview) {
                if (data.avatar_url) {
                    avatarPreview.src = data.avatar_url;
                } else {
                    // Default blank / white avatar
                    avatarPreview.src = "https://via.placeholder.com/150/FFFFFF/CCCCCC?text=No+Photo";
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initEditProfilePage };
}
