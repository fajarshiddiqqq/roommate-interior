<script>
    export let data;
	let { portfolioItems } = data;
    
</script>

<div class="max-w-8xl container mx-auto flex flex-col p-8">
	<!-- banner -->
    <div class="container mx-auto max-w-7xl px-6 py-12">
        <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Featured Project Image -->
            <div class="w-full md:w-3/5">
                <img 
                    src="/assets/hero.jpg" 
                    alt="Featured Project" 
                    class="w-full h-[500px] object-cover rounded-2xl shadow-lg"
                />
            </div>
    
            <!-- Text Content -->
            <div class="w-full md:w-2/5 flex flex-col justify-center space-y-4">
                <h3 class="text-5xl md:text-6xl font-black">Projects</h3>
                <p class="text-gray-600 text-lg">
                    Explore our past work, featuring a variety of styles and spaces.
                </p>
            </div>
        </div>
    </div>

    <!-- Projects Grid -->
    <div class="container mx-auto max-w-7xl px-6 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {#each portfolioItems as item}
                <a href={`/portfolios/${item.slug}`} class="relative group block overflow-hidden rounded-lg shadow-lg">
                    <!-- Image -->
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        class="w-full h-[300px] object-cover transition-all duration-100 group-hover:blur-md"
                    />
    
                    <!-- Overlay with Title -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                        <h4 class="text-white text-lg font-semibold text-center px-4">{item.title}</h4>
                    </div>
                </a>
            {/each}
    
            <!-- CTA Card -->
            <div class="flex flex-col items-center justify-center text-center bg-gray-100 rounded-lg shadow-lg p-8 min-h-[300px]">
                <h3 class="text-2xl font-bold text-gray-800">The Next Project is Yours!</h3>
                <p class="text-gray-600 mt-2">Let's bring your vision to life. Start your project today.</p>
                <a href="https://wa.me/+6281228659154?text=Hello!%20I%20would%20like%20to%20start%20a%20project" target="_blank" class="mt-4 px-6 py-3 bg-[#ED7D2B] text-white font-semibold rounded-lg hover:bg-[#d66d24] transition">
                    Contact Us
                </a>
            </div>
        </div>
    </div>
    
</div>
